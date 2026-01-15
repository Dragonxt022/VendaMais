const { User } = require('../../models');
const path = require('path');
const fs = require('fs');

class ProfileController {
    async index(req, res) {
        try {
            const user = await User.findByPk(req.session.user.id);
            return {
                title: 'Meu Perfil - VendaMais',
                user
            };
        } catch (error) {
            throw error;
        }
    }

    async update(req, res) {
        try {
            const { name, email, cpf_cnpj } = req.body;
            const userId = req.session.user.id;

            if (!name || !email) {
                const user = await User.findByPk(userId);
                return res.render('user/profile', {
                    layout: 'user/layouts/user',
                    title: 'Meu Perfil - VendaMais',
                    user,
                    error: 'Nome e e-mail são obrigatórios'
                });
            }

            const user = await User.findByPk(userId);
            const updateData = { name, email, cpf_cnpj };

            if (req.file) {
                if (user.avatar) {
                    const oldAvatarPath = path.join(__dirname, '../../../public', user.avatar);
                    if (fs.existsSync(oldAvatarPath)) {
                        fs.unlinkSync(oldAvatarPath);
                    }
                }
                updateData.avatar = `/uploads/avatars/${req.file.filename}`;
            }

            await user.update(updateData);

            // Atualiza sessão com novos dados
            req.session.user.name = user.name;
            req.session.user.email = user.email;
            req.session.user.avatar = user.avatar;

            req.session.notification = { 
                type: 'success', 
                message: 'Seu perfil foi atualizado com sucesso!' 
            };

            req.session.save(() => {
                res.redirect('/app/profile');
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProfileController();
