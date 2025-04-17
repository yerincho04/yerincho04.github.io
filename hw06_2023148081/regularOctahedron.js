export function createRegularOctahedron() {
    const sqrt05 = Math.sqrt(0.5);

    // 6 vertices (공유 구조)
    const vertices = [
        // Top vertex
        0.0,  sqrt05,  0.0,   // 0
        // Bottom vertex
        0.0, -sqrt05,  0.0,   // 1
        // Middle square (edge length 1, on xz-plane)
        0.5, 0.0,  0.5,       // 2: front-right
       -0.5, 0.0,  0.5,       // 3: front-left
       -0.5, 0.0, -0.5,       // 4: back-left
        0.5, 0.0, -0.5        // 5: back-right
    ];

    // Face indices (8 triangles)
    const indices = [
        0, 2, 3,  // top front
        0, 3, 4,  // top left
        0, 4, 5,  // top back
        0, 5, 2,  // top right
        1, 3, 2,  // bottom front
        1, 4, 3,  // bottom left
        1, 5, 4,  // bottom back
        1, 2, 5   // bottom right
    ];

    // Texture coordinates per vertex (shared)
    const texCoords = [
        0.5, 0.0,   // 0: top
        0.5, 1.0,   // 1: bottom
        1.0, 0.5,   // 2: front-right
        0.0, 0.5,   // 3: front-left
        0.0, 0.0,   // 4: back-left
        1.0, 0.0    // 5: back-right
    ];

    // Normals per vertex (normalized position vector)
    const normals = [];
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        const length = Math.sqrt(x * x + y * y + z * z);
        normals.push(x / length, y / length, z / length);
    }

    // White color for all vertices
    const colors = [];
    for (let i = 0; i < vertices.length / 3; i++) {
        colors.push(1.0, 1.0, 1.0, 1.0);
    }

    return {
        vertices: vertices,
        indices: indices,
        texCoords: texCoords,
        normals: normals,
        colors: colors
    };
}