import { describe, it, expect, beforeEach } from 'vitest';
import { OperationQueue } from '../src/core/OperationQueue';
import type { Operation } from '../src/operations/base/Operation';

function mockOp(label: string): Operation {
  return {
    type: 'filter',
    params: { filterType: label },
    apply: async () => {},
    validate: () => true,
  };
}

describe('OperationQueue', () => {
  let queue: OperationQueue;

  beforeEach(() => {
    queue = new OperationQueue();
  });

  it('starts empty with no undo/redo', () => {
    expect(queue.canUndo()).toBe(false);
    expect(queue.canRedo()).toBe(false);
    expect(queue.getActiveOperations()).toHaveLength(0);
  });

  it('enqueue adds operations', () => {
    queue.enqueue(mockOp('a'));
    queue.enqueue(mockOp('b'));
    expect(queue.getActiveOperations()).toHaveLength(2);
    expect(queue.canUndo()).toBe(true);
    expect(queue.canRedo()).toBe(false);
  });

  it('undo removes last operation from active list', () => {
    queue.enqueue(mockOp('a'));
    queue.enqueue(mockOp('b'));
    queue.undo();
    expect(queue.getActiveOperations()).toHaveLength(1);
    expect(queue.canRedo()).toBe(true);
  });

  it('redo restores undone operation', () => {
    queue.enqueue(mockOp('a'));
    queue.enqueue(mockOp('b'));
    queue.undo();
    queue.redo();
    expect(queue.getActiveOperations()).toHaveLength(2);
    expect(queue.canRedo()).toBe(false);
  });

  it('enqueue after undo discards future operations', () => {
    queue.enqueue(mockOp('a'));
    queue.enqueue(mockOp('b'));
    queue.undo();
    queue.enqueue(mockOp('c'));
    expect(queue.getActiveOperations()).toHaveLength(2);
    expect(queue.canRedo()).toBe(false);
    expect(queue.getAllOperations()).toHaveLength(2);
  });

  it('reset moves index to -1 but keeps operations', () => {
    queue.enqueue(mockOp('a'));
    queue.enqueue(mockOp('b'));
    queue.reset();
    expect(queue.getActiveOperations()).toHaveLength(0);
    expect(queue.getAllOperations()).toHaveLength(2);
    expect(queue.canRedo()).toBe(true);
  });

  it('clear removes everything', () => {
    queue.enqueue(mockOp('a'));
    queue.clear();
    expect(queue.getActiveOperations()).toHaveLength(0);
    expect(queue.getAllOperations()).toHaveLength(0);
    expect(queue.canUndo()).toBe(false);
    expect(queue.canRedo()).toBe(false);
  });
});
