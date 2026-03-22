const { Account, AccountCategory } = require('../../models');
const { createUploadMiddleware } = require('../../middleware/uploadMiddleware');
const imageService = require('../../services/imageService');
const { normalizeCurrencyInput } = require('../../utils');
const {
  getAccountCategories,
  ensureDefaultAccountCategory,
  resolveCategoryForAccount
} = require('../../services/accountCategoryService');

function normalizeAccountPayload(body, category) {
  return {
    account_category_id: category.id,
    name: category.name,
    amount: normalizeCurrencyInput(body.amount),
    issued_at: body.issued_at,
    due_date: body.due_date,
    notes: body.notes || null
  };
}

async function runAttachmentUpload(req, res) {
  const uploadMiddleware = createUploadMiddleware({
    destination: 'src/public/uploads',
    subDirectory: 'accounts',
    fieldName: 'attachment',
    maxFileSize: 8 * 1024 * 1024,
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ],
    invalidFileMessage: 'Envie uma imagem ou um arquivo PDF valido.'
  });

  await new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

class AccountController {
  async list(req, res) {
    const { company_id } = req.user;
    await ensureDefaultAccountCategory(company_id);

    const accounts = await Account.findAll({
      where: { company_id },
      include: [{
        model: AccountCategory,
        attributes: ['id', 'name', 'color']
      }],
      order: [['due_date', 'ASC'], ['createdAt', 'DESC']]
    });

    const today = new Date().toISOString().slice(0, 10);
    const serializedAccounts = [];

    for (const account of accounts) {
      let category = account.AccountCategory;

      if (!category) {
        const categoryId = await resolveCategoryForAccount(account, company_id);
        category = await AccountCategory.findByPk(categoryId, {
          attributes: ['id', 'name', 'color']
        });
      }

      serializedAccounts.push({
        ...account.toJSON(),
        AccountCategory: category,
        isOverdue: account.due_date < today
      });
    }

    return {
      title: 'Contas - VendaMais',
      accounts: serializedAccounts
    };
  }

  async showCreatePage(req, res) {
    const { company_id } = req.user;
    const categories = await getAccountCategories(company_id);
    const defaultCategory = await ensureDefaultAccountCategory(company_id);

    return {
      title: 'Nova Conta - VendaMais',
      pageTitle: 'Nova Conta',
      submitLabel: 'Cadastrar conta',
      formMode: 'create',
      categories,
      account: {
        account_category_id: defaultCategory.id,
        amount: '',
        issued_at: '',
        due_date: '',
        notes: '',
        attachment_url: null
      }
    };
  }

  async showEditPage(req, res) {
    const { company_id } = req.user;
    const categories = await getAccountCategories(company_id);
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        company_id
      },
      include: [{
        model: AccountCategory,
        attributes: ['id', 'name', 'color']
      }]
    });

    if (!account) {
      throw new Error('Conta nao encontrada');
    }

    if (!account.account_category_id) {
      const categoryId = await resolveCategoryForAccount(account, company_id);
      account.account_category_id = categoryId;
    }

    return {
      title: 'Editar Conta - VendaMais',
      pageTitle: 'Editar Conta',
      submitLabel: 'Salvar alteracoes',
      formMode: 'edit',
      categories,
      account
    };
  }

  async create(req, res) {
    const { company_id } = req.user;
    await runAttachmentUpload(req, res);

    const category = await AccountCategory.findOne({
      where: {
        id: req.body.account_category_id,
        company_id
      }
    }) || await ensureDefaultAccountCategory(company_id);

    const payload = normalizeAccountPayload(req.body, category);
    if (req.file) {
      payload.attachment_url = imageService.processUploadedFile(req.file).relativePath;
    }

    await Account.create({
      company_id,
      ...payload
    });
  }

  async update(req, res) {
    const { company_id } = req.user;
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        company_id
      }
    });

    if (!account) {
      throw new Error('Conta nao encontrada');
    }

    await runAttachmentUpload(req, res);

    const category = await AccountCategory.findOne({
      where: {
        id: req.body.account_category_id,
        company_id
      }
    }) || await ensureDefaultAccountCategory(company_id);

    const payload = normalizeAccountPayload(req.body, category);
    payload.attachment_url = account.attachment_url;

    if (req.file) {
      if (account.attachment_url) {
        imageService.deleteImage(account.attachment_url);
      }
      payload.attachment_url = imageService.processUploadedFile(req.file).relativePath;
    } else if (req.body.removeAttachment === 'true' && account.attachment_url) {
      imageService.deleteImage(account.attachment_url);
      payload.attachment_url = null;
    }

    await account.update(payload);
  }
}

module.exports = new AccountController();
