let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse events
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY);
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
      
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    // Touch events
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY);
    });

    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return;
      e.preventDefault();
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
      
      // Detect two-finger touch for rotation
      if(e.touches.length >= 2) {
        this.rotating = true;
      }
    });

    // Common end events
    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };
    
    window.addEventListener('mouseup', handleEnd);
    paper.addEventListener('touchend', handleEnd);
    paper.addEventListener('touchcancel', handleEnd);
  }

  handleMove(clientX, clientY) {
    if(!this.rotating) {
      this.moveX = clientX;
      this.moveY = clientY;
      
      this.velX = this.moveX - this.prevX;
      this.velY = this.moveY - this.prevY;
    }
      
    const dirX = clientX - this.startX;
    const dirY = clientY - this.startY;
    const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
    
    if(dirLength > 5) { // Minimum distance to start rotating
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      
      if(this.rotating) {
        this.rotation = degrees;
      }
    }

    if(this.holdingPaper) {
      if(!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevX = this.moveX;
      this.prevY = this.moveY;

      this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.paper = paper; // Store reference to paper element
  p.init(paper);
});

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});