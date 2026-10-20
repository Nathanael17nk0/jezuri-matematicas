import math
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, output_path, maskable=False):
    # Create RGBA canvas
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient
    # Deep slate / blue background: #0f172a to #1e1b4b
    bg = Image.new('RGBA', (size, size), (15, 23, 42, 255))
    bg_draw = ImageDraw.Draw(bg)
    
    # Draw radial/diagonal gradient
    for y in range(size):
        ratio = y / size
        r = int(15 * (1 - ratio) + 30 * ratio)
        g = int(23 * (1 - ratio) + 27 * ratio)
        b = int(42 * (1 - ratio) + 75 * ratio)
        bg_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
        
    # Mask background into a rounded rect (if not maskable, round corners; if maskable, fill whole area or safe circle)
    if not maskable:
        corner_radius = int(size * 0.22)
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=255)
        img.paste(bg, (0, 0), mask)
    else:
        img.paste(bg, (0, 0))
        
    draw = ImageDraw.Draw(img)
    
    # Draw glowing accent circle in center
    cx, cy = size // 2, size // 2
    accent_r = int(size * 0.38)
    
    # Gradient badge in center
    # Draw rounded card inside
    card_margin = int(size * 0.18)
    card_r = int(size * 0.12)
    card_box = [card_margin, card_margin, size - card_margin, size - card_margin]
    
    # Card background: gradient from #3b82f6 to #8b5cf6
    card = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(card)
    c_draw.rounded_rectangle(card_box, radius=card_r, fill=(30, 41, 59, 230), outline=(59, 130, 246, 255), width=max(2, int(size * 0.02)))
    img = Image.alpha_composite(img, card)
    draw = ImageDraw.Draw(img)
    
    # Draw mathematical symbols or logo:
    # Top-left: M.C.D. / ÷
    # Top-right: x
    # Bottom-left: +
    # Bottom-right: =
    scale = size / 512.0
    
    # Draw central divide line (horizontal and vertical like table)
    lw = max(2, int(6 * scale))
    draw.line([(card_box[0] + int(20 * scale), cy), (card_box[2] - int(20 * scale), cy)], fill=(99, 102, 241, 200), width=lw)
    draw.line([(cx, card_box[1] + int(20 * scale)), (cx, card_box[3] - int(20 * scale))], fill=(99, 102, 241, 200), width=lw)
    
    # Draw Division Symbol (÷) in quadrant 1 (top-left)
    q1_x, q1_y = (card_box[0] + cx) // 2, (card_box[1] + cy) // 2
    bar_w = int(36 * scale)
    bar_h = max(2, int(8 * scale))
    dot_r = max(2, int(6 * scale))
    # Dot top
    draw.ellipse([q1_x - dot_r, q1_y - int(18 * scale) - dot_r, q1_x + dot_r, q1_y - int(18 * scale) + dot_r], fill=(56, 189, 248, 255))
    # Bar
    draw.rounded_rectangle([q1_x - bar_w // 2, q1_y - bar_h // 2, q1_x + bar_w // 2, q1_y + bar_h // 2], radius=bar_h // 2, fill=(56, 189, 248, 255))
    # Dot bottom
    draw.ellipse([q1_x - dot_r, q1_y + int(18 * scale) - dot_r, q1_x + dot_r, q1_y + int(18 * scale) + dot_r], fill=(56, 189, 248, 255))
    
    # Draw Algebra (x) in quadrant 2 (top-right)
    q2_x, q2_y = (cx + card_box[2]) // 2, (card_box[1] + cy) // 2
    d = int(22 * scale)
    draw.line([(q2_x - d, q2_y - d), (q2_x + d, q2_y + d)], fill=(167, 139, 250, 255), width=max(3, int(9 * scale)))
    draw.line([(q2_x + d, q2_y - d), (q2_x - d, q2_y + d)], fill=(167, 139, 250, 255), width=max(3, int(9 * scale)))
    
    # Draw Plus (+) in quadrant 3 (bottom-left)
    q3_x, q3_y = (card_box[0] + cx) // 2, (cy + card_box[3]) // 2
    p = int(22 * scale)
    draw.line([(q3_x - p, q3_y), (q3_x + p, q3_y)], fill=(245, 158, 11, 255), width=max(3, int(9 * scale)))
    draw.line([(q3_x, q3_y - p), (q3_x, q3_y + p)], fill=(245, 158, 11, 255), width=max(3, int(9 * scale)))
    
    # Draw Fraction / Equal (=) in quadrant 4 (bottom-right)
    q4_x, q4_y = (cx + card_box[2]) // 2, (cy + card_box[3]) // 2
    ew = int(24 * scale)
    eh = max(2, int(6 * scale))
    gap = int(12 * scale)
    draw.rounded_rectangle([q4_x - ew, q4_y - gap - eh // 2, q4_x + ew, q4_y - gap + eh // 2], radius=eh // 2, fill=(16, 185, 129, 255))
    draw.rounded_rectangle([q4_x - ew, q4_y + gap - eh // 2, q4_x + ew, q4_y + gap + eh // 2], radius=eh // 2, fill=(16, 185, 129, 255))
    
    img.save(output_path, 'PNG')
    print(f"Saved {output_path} ({size}x{size})")

if __name__ == '__main__':
    create_icon(192, 'icons/icon-192.png', maskable=False)
    create_icon(512, 'icons/icon-512.png', maskable=False)
    create_icon(192, 'icons/icon-maskable-192.png', maskable=True)
    create_icon(512, 'icons/icon-maskable-512.png', maskable=True)
    create_icon(180, 'icons/apple-touch-icon.png', maskable=False)
