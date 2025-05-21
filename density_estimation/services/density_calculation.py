import numpy as np
from shapely.geometry import Polygon

def calculate_density(image_shape, bboxes):
    """
    Tính mật độ giao thông dựa trên diện tích các bounding box không bị chồng lặp.
    
    Parameters:
        image_shape: tuple(int, int), định dạng (height, width)
        bboxes: List[List[int]], mỗi box dạng [x1, y1, x2, y2]
    
    Returns:
        density: float, tỷ lệ giữa tổng diện tích bounding box hợp nhất và diện tích ảnh
    """
    height, width = image_shape
    image_area = height * width

    # Chuyển mỗi bbox thành một Polygon
    polygons = [
        Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])
        for x1, y1, x2, y2 in bboxes
    ]

    # Tính diện tích hợp nhất của tất cả polygons
    if not polygons:
        return 0.0

    merged = polygons[0]
    for poly in polygons[1:]:
        merged = merged.union(poly)

    merged_area = merged.area
    density = merged_area / image_area
    return min(density, 1.0)  # đảm bảo không vượt quá 1