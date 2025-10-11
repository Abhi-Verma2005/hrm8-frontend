import type { DashboardWidget } from './types';

export function findEmptySpace(
  widgets: DashboardWidget[],
  requiredWidth: number,
  requiredHeight: number
): { x: number; y: number; w: number; h: number } {
  const grid: boolean[][] = Array(100).fill(0).map(() => Array(12).fill(false));
  
  // Mark occupied cells
  widgets.forEach(w => {
    for (let y = w.gridArea.y; y < w.gridArea.y + w.gridArea.h; y++) {
      for (let x = w.gridArea.x; x < w.gridArea.x + w.gridArea.w; x++) {
        if (grid[y] && grid[y][x] !== undefined) {
          grid[y][x] = true;
        }
      }
    }
  });
  
  // Find first available space
  for (let y = 0; y < grid.length - requiredHeight; y++) {
    for (let x = 0; x <= 12 - requiredWidth; x++) {
      let canFit = true;
      
      for (let dy = 0; dy < requiredHeight && canFit; dy++) {
        for (let dx = 0; dx < requiredWidth && canFit; dx++) {
          if (grid[y + dy][x + dx]) {
            canFit = false;
          }
        }
      }
      
      if (canFit) {
        return { x, y, w: requiredWidth, h: requiredHeight };
      }
    }
  }
  
  // No space found, add to bottom
  const maxY = Math.max(...widgets.map(w => w.gridArea.y + w.gridArea.h), 0);
  return { x: 0, y: maxY, w: requiredWidth, h: requiredHeight };
}

export function hasCollision(
  widget: DashboardWidget,
  otherWidgets: DashboardWidget[]
): boolean {
  return otherWidgets.some(other => {
    if (other.id === widget.id) return false;
    
    return !(
      widget.gridArea.x + widget.gridArea.w <= other.gridArea.x ||
      widget.gridArea.x >= other.gridArea.x + other.gridArea.w ||
      widget.gridArea.y + widget.gridArea.h <= other.gridArea.y ||
      widget.gridArea.y >= other.gridArea.y + other.gridArea.h
    );
  });
}
