const { User } = require('../../models');
const path = require('path');
const fs = require('fs');

class ProfileController {
    async index(req, res) {
        try {
            const user = await User.findByPk(req.user.id);
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
            const { name, cpf_cnpj } = req.body;
            const user = await User.findByPk(req.user.id);

            const updateData = { name, cpf_cnpj };

            if (req.file) {
                // remove avatar antigo, se existir
                if (user.avatar) {
                    const oldAvatarPath = path.join(
                        __dirname,
                        '../../../public',
                        user.avatar
                    );

                    if (fs.existsSync(oldAvatarPath)) {
                        fs.unlinkSync(oldAvatarPath);
                    }
                }

                // salva novo avatar
                updateData.avatar = `/uploads/avatars/${req.file.filename}`;
            }

            await user.update(updateData);

            // atualiza sessão
            req.session.user.name = user.name;
            req.session.user.avatar = user.avatar;

            req.session.notification = { 
                type: 'success', 
                message: 'Seu perfil foi atualizado com sucesso!' 
            };

            return { success: true };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProfileController();
