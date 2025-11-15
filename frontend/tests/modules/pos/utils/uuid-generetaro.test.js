import { vi } from 'vitest';
import { generateUUID } from '../../../../src/modules/pos/utils/uuid-generetaro.js';

describe('generateUUID', () => {
  it('crea un identificador con el formato RFC4122 v4', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const uuid = generateUUID();

    expect(uuid).toMatch(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/);
    expect(uuid[14]).toBe('4');
    expect(['8', '9', 'a', 'b']).toContain(uuid[19]);

    randomSpy.mockRestore();
  });
});
