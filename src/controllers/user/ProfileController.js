const { User } = require('../../models');
const { createUploadMiddleware } = require('../../middleware/uploadMiddleware');
const imageService = require('../../services/imageService');

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

    async update(req, res, next) {
        try {
            // Execute upload middleware
            const uploadMiddleware = createUploadMiddleware({
                destination: 'src/public/uploads',
                subDirectory: 'avatars',
                fieldName: 'avatar'
            });

            await new Promise((resolve, reject) => {
                uploadMiddleware(req, res, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            const { name, email, cpf_cnpj, removeAvatar } = req.body;
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

            // Handle avatar upload or removal
            if (req.file) {
                // Delete old avatar if exists
                if (user.avatar) {
                    imageService.deleteImage(user.avatar);
                }
                const imageData = imageService.processUploadedImage(req.file, 'avatars');
                updateData.avatar = imageData.relativePath;
            } else if (removeAvatar === 'true' && user.avatar) {
                imageService.deleteImage(user.avatar);
                updateData.avatar = null;
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
