import { out, err } from '../../src/output';

test('stdout implemented', () => expect(typeof out).toBe('function'));
test('stderr implemented', () => expect(typeof err).toBe('function'));
