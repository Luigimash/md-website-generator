// Carousel functionality for Obsidian carousel plugin compatibility
class Carousel {
  constructor(container) {
    this.container = container;
    this.viewport = container.querySelector('.carousel-viewport');
    this.track = container.querySelector('.carousel-track');
    this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    this.prevButton = container.querySelector('.carousel-prev');
    this.nextButton = container.querySelector('.carousel-next');

    // Parse configuration from data attributes
    this.config = {
      loop: container.dataset.loop === 'true',
      direction: container.dataset.direction || 'ltr',
      slidesToScroll: container.dataset.slidesToScroll === 'auto' ? 1 : parseInt(container.dataset.slidesToScroll) || 1,
      dragfree: container.dataset.dragfree === 'true',
      align: container.dataset.align || 'center',
      axis: container.dataset.axis || 'x',
      autoplay: container.dataset.autoplay === 'true',
      autoscroll: container.dataset.autoscroll === 'true',
      fade: container.dataset.fade === 'true'
    };

    this.currentIndex = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.autoplayInterval = null;
    this.autoscrollInterval = null;

    this.init();
  }

  init() {
    // Set up RTL if needed
    if (this.config.direction === 'rtl') {
      this.track.style.direction = 'rtl';
    }

    // Set up fade mode
    if (this.config.fade) {
      this.track.classList.add('fade');
      this.slides.forEach((slide, index) => {
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.transition = 'opacity 0.3s ease';
      });
    }

    // Set up vertical carousel
    if (this.config.axis === 'y') {
      this.track.style.flexDirection = 'column';
    }

    // Set up button handlers
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Set up drag handlers
    this.track.addEventListener('mousedown', this.dragStart.bind(this));
    this.track.addEventListener('touchstart', this.dragStart.bind(this), { passive: true });
    this.track.addEventListener('mouseup', this.dragEnd.bind(this));
    this.track.addEventListener('touchend', this.dragEnd.bind(this));
    this.track.addEventListener('mousemove', this.drag.bind(this));
    this.track.addEventListener('touchmove', this.drag.bind(this), { passive: true });
    this.track.addEventListener('mouseleave', this.dragEnd.bind(this));

    // Prevent context menu on drag
    this.track.addEventListener('contextmenu', (e) => {
      if (this.isDragging) e.preventDefault();
    });

    // Set up autoplay
    if (this.config.autoplay) {
      this.startAutoplay();
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // Set up autoscroll
    if (this.config.autoscroll) {
      this.startAutoscroll();
      this.container.addEventListener('mouseenter', () => this.stopAutoscroll());
      this.container.addEventListener('mouseleave', () => this.startAutoscroll());
    }

    // Initial position
    this.updatePosition();
  }

  getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  getPositionY(event) {
    return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
  }

  dragStart(event) {
    this.isDragging = true;
    this.startPos = this.config.axis === 'x' ? this.getPositionX(event) : this.getPositionY(event);
    this.track.style.cursor = 'grabbing';
    this.track.style.transition = 'none';
  }

  drag(event) {
    if (!this.isDragging) return;

    const currentPosition = this.config.axis === 'x' ? this.getPositionX(event) : this.getPositionY(event);
    const diff = currentPosition - this.startPos;
    this.currentTranslate = this.prevTranslate + diff;

    if (!this.config.fade) {
      const property = this.config.axis === 'x' ? 'translateX' : 'translateY';
      this.track.style.transform = `${property}(${this.currentTranslate}px)`;
    }
  }

  dragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track.style.cursor = 'grab';
    this.track.style.transition = '';

    const movedBy = this.currentTranslate - this.prevTranslate;
    const slideSize = this.config.axis === 'x' ? this.viewport.offsetWidth : this.viewport.offsetHeight;

    // Determine direction and update index
    if (movedBy < -slideSize / 4) {
      this.next();
    } else if (movedBy > slideSize / 4) {
      this.prev();
    } else {
      this.updatePosition();
    }
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex += this.config.slidesToScroll;
      if (this.currentIndex >= this.slides.length) {
        this.currentIndex = this.slides.length - 1;
      }
    } else if (this.config.loop) {
      this.currentIndex = 0;
    }
    this.updatePosition();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.config.slidesToScroll;
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }
    } else if (this.config.loop) {
      this.currentIndex = this.slides.length - 1;
    }
    this.updatePosition();
  }

  updatePosition() {
    if (this.config.fade) {
      // Fade mode
      this.slides.forEach((slide, index) => {
        slide.style.opacity = index === this.currentIndex ? '1' : '0';
      });
      this.prevTranslate = 0;
      this.currentTranslate = 0;
    } else {
      // Scroll mode
      const slideSize = this.config.axis === 'x' ? this.viewport.offsetWidth : this.viewport.offsetHeight;
      let offset = -this.currentIndex * slideSize;

      // Apply alignment
      if (this.config.align === 'start') {
        // No adjustment needed
      } else if (this.config.align === 'end') {
        const trackSize = this.config.axis === 'x' ? this.track.offsetWidth : this.track.offsetHeight;
        offset = -(trackSize - slideSize);
      } else if (this.config.align === 'center') {
        // Center is the default behavior with flex
      }

      this.prevTranslate = offset;
      this.currentTranslate = offset;

      const property = this.config.axis === 'x' ? 'translateX' : 'translateY';
      this.track.style.transform = `${property}(${offset}px)`;
    }
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 3000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  startAutoscroll() {
    if (this.autoscrollInterval) return;
    this.autoscrollInterval = setInterval(() => {
      if (!this.config.fade) {
        const slideSize = this.config.axis === 'x' ? this.viewport.offsetWidth : this.viewport.offsetHeight;
        this.currentTranslate -= 1;

        // Reset when scrolled past all slides
        const totalSize = this.slides.length * slideSize;
        if (Math.abs(this.currentTranslate) >= totalSize) {
          this.currentTranslate = 0;
        }

        const property = this.config.axis === 'x' ? 'translateX' : 'translateY';
        this.track.style.transform = `${property}(${this.currentTranslate}px)`;
      }
    }, 16); // ~60fps
  }

  stopAutoscroll() {
    if (this.autoscrollInterval) {
      clearInterval(this.autoscrollInterval);
      this.autoscrollInterval = null;
    }
  }
}

// Initialize all carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(container => {
    new Carousel(container);
  });
});
