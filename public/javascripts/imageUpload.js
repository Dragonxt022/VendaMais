window.ImageUpload = class ImageUpload {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      previewSize: 'w-full h-full',
      fallbackImage: '/images/placeholders/product-placeholder.svg',
      ...options
    };
    if (this.container && this.container.imageUpload) {
      return this.container.imageUpload;
    }
    
    this.fileInput = null;
    this.previewImage = null;
    this.uploadOverlay = null;
    this.currentImageUrl = null;
    this.onImageChange = options.onImageChange || (() => {});
    
    this.init();
  }
  
  init() {
    if (!this.container) return;
    
    this.container.classList.add('relative', 'overflow-hidden');
    
    // Ensure it has some display
    if (!this.container.style.width && !this.container.classList.contains('w-full')) {
        this.container.classList.add('w-24', 'h-24');
    }
    
    this.createUploadOverlay();
    this.createPreviewImage();
    this.createFileInput();
    
    // Suporte para arrastar e soltar continua no container
    this.container.addEventListener('dragover', this.handleDragOver.bind(this));
    this.container.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.container.addEventListener('drop', this.handleDrop.bind(this));
    
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    
    // Add click listener to container to trigger file input
    this.container.addEventListener('click', () => this.fileInput.click());
  }
  
  createUploadOverlay() {
    this.uploadOverlay = document.createElement('div');
    this.uploadOverlay.className = `
      absolute inset-0 flex flex-col items-center justify-center
      bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200
      pointer-events-none z-10
    `;
    
    this.uploadOverlay.innerHTML = `
      <svg class="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="text-white text-[10px] font-bold uppercase tracking-wider">Alterar</span>
    `;
    
    this.container.appendChild(this.uploadOverlay);
  }
  
  createPreviewImage() {
    this.previewImage = document.createElement('img');
    this.previewImage.className = `${this.options.previewSize} object-cover pointer-events-none`;
    this.previewImage.src = this.options.fallbackImage;
    this.previewImage.alt = 'Preview';
    this.previewImage.onerror = () => {
      this.previewImage.src = this.options.fallbackImage;
    };
    
    this.container.appendChild(this.previewImage);
  }
  
  createFileInput() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.name = 'image';
    this.fileInput.accept = this.options.allowedTypes.join(',');
    this.fileInput.className = 'hidden'; // Label handles the click automatically
    this.container.appendChild(this.fileInput);
  }
  
  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.container.classList.add('border-blue-500', 'bg-blue-50');
  }
  
  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.container.classList.remove('border-blue-500', 'bg-blue-50');
  }
  
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.container.classList.remove('border-blue-500', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }
  
  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }
  
  processFile(file) {
    if (!this.validateFile(file)) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage.src = e.target.result;
      this.currentImageUrl = e.target.result;
      this.uploadOverlay.innerHTML = ''; // Limpa o texto/ícone após selecionar
      this.onImageChange(file, e.target.result);
    };
    reader.readAsDataURL(file);
  }
  
  validateFile(file) {
    if (!this.options.allowedTypes.includes(file.type)) {
      this.showError('Tipo de arquivo inválido. Apenas JPEG, PNG, GIF e WebP são permitidos.');
      return false;
    }
    
    if (file.size > this.options.maxSize) {
      this.showError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return false;
    }
    
    return true;
  }
  
  showError(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
  
  setImage(url) {
    if (url) {
      this.previewImage.src = url;
      this.currentImageUrl = url;
    } else {
      this.previewImage.src = this.options.fallbackImage;
      this.currentImageUrl = null;
    }
  }
  
  getImage() {
    return this.currentImageUrl;
  }
  
  reset() {
    this.previewImage.src = this.options.fallbackImage;
    this.currentImageUrl = null;
    this.fileInput.value = '';
  }
  
  destroy() {
    this.container.removeEventListener('click', () => this.fileInput.click());
    this.container.removeEventListener('dragover', this.handleDragOver);
    this.container.removeEventListener('dragleave', this.handleDragLeave);
    this.container.removeEventListener('drop', this.handleDrop);
    this.fileInput.removeEventListener('change', this.handleFileSelect);
  }
}

// Função para inicializar elementos automaticamente
function initializeAllImageUploads() {
  const uploadElements = document.querySelectorAll('[data-image-upload]');
  console.log(`Encontrados ${uploadElements.length} elementos de upload`);
  
  uploadElements.forEach(element => {
    const type = element.dataset.imageUpload || 'product';
    const fallback = `/images/placeholders/${type}-placeholder.svg`;
    
    console.log(`Inicializando upload automático para: ${element.id}`);
    
    const instance = new ImageUpload(`#${element.id}`, {
      fallbackImage: fallback,
      onImageChange: (file, dataUrl) => {
        element.dataset.imageChanged = 'true';
        element.dataset.imageFile = JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    });
    element.imageUpload = instance;
    if (element.id === 'productImageUpload') {
        window.imageUploadInstance = instance;
    }
  });
}

// Inicialização automática para elementos com data-image-upload
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAllImageUploads);
} else {
  // Documento já carregado
  setTimeout(initializeAllImageUploads, 100);
}

// Debug: Verificar se a classe está disponível globalmente
console.log('ImageUpload class available:', typeof window.ImageUpload !== 'undefined');
console.log('Script imageUpload.js carregado com sucesso!');