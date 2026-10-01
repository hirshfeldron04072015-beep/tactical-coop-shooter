window.LastLine = window.LastLine || {};

window.LastLine.Draw = {
  rgb(arr) {
    return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
  },
  rgba(arr, alpha) {
    return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${alpha})`;
  },
  rect(x, y, w, h, color, fill = true) {
    const ctx = window.LastLine.ctx;
    if (fill) {
      ctx.fillStyle = this.rgb(color);
      ctx.fillRect(x, y, w, h);
    }
  },
  circle(x, y, r, color, fill = true) {
    const ctx = window.LastLine.ctx;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = this.rgb(color);
      ctx.fill();
    }
  },
  line(x1, y1, x2, y2, color, width = 1) {
    const ctx = window.LastLine.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = this.rgb(color);
    ctx.lineWidth = width;
    ctx.stroke();
  },
  text(str, x, y, color, size = 16, weight = "normal", align = "left") {
    const ctx = window.LastLine.ctx;
    ctx.fillStyle = this.rgb(color);
    ctx.font = `${weight} ${size}px Arial`;
    ctx.textAlign = align;
    ctx.fillText(str, x, y);
  },
  background() {
    const ctx = window.LastLine.ctx;
    const C = window.LastLine.CONFIG;
    ctx.fillStyle = this.rgb(C.COLORS.DARK);
    ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < C.WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, C.HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < C.HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(C.WIDTH, y);
      ctx.stroke();
    }
  }
};