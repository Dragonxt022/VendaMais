const path = require('path');
const fs = require('fs');

class ImageService {
  constructor() {
    this.baseUrl = process.env.BASE_URL || '';
    this.publicRoot = path.join(process.cwd(), 'src', 'public');
  }

  generateImageUrl(filePath) {
    if (!filePath) return null;
    const cleanPath = filePath.replace(/\\/g, '/');
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  deleteImage(imagePath) {
    if (!imagePath) return true;

    try {
      const normalized = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
      const relativeToPublic = normalized.startsWith('uploads/')
        ? normalized
        : normalized.replace(/^src\/public\//, '');
      const fullPath = path.join(this.publicRoot, relativeToPublic);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }
  }

  validateImageSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const maxSize = 5 * 1024 * 1024;
      return stats.size <= maxSize;
    } catch (error) {
      console.error('Erro ao validar tamanho da imagem:', error);
      return false;
    }
  }

  getFallbackImage(type = 'product') {
    const fallbackImages = {
      product: '/images/placeholders/product-placeholder.svg',
      avatar: '/images/placeholders/avatar-placeholder.svg',
      logo: '/images/placeholders/logo-placeholder.svg'
    };

    return fallbackImages[type] || fallbackImages.product;
  }

  createDirectoryStructure(basePath, subDir = '') {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const fullPath = path.join(basePath, subDir, year.toString(), month);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    return fullPath;
  }

  processUploadedImage(file) {
    if (!file) return null;

    const relativePath = path.relative(this.publicRoot, file.path).replace(/\\/g, '/');
    const finalPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

    console.log('[IMAGE SERVICE] Processando imagem:', {
      originalPath: file.path,
      relativePath,
      finalPath,
      generatedUrl: this.generateImageUrl(finalPath)
    });

    return {
      url: this.generateImageUrl(finalPath),
      path: file.path,
      relativePath: finalPath,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  async optimizeImage(imagePath, quality = 80) {
    return imagePath;
  }
}

module.exports = new ImageService();
