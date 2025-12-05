
// A lightweight testing framework for the browser

export type TestResult = {
    description: string;
    passed: boolean;
    error?: string;
    duration: number;
};

export type TestSuite = {
    name: string;
    tests: { description: string; fn: () => Promise<void> | void }[];
};

export class TestRunnerEngine {
    suites: TestSuite[] = [];

    describe(name: string, fn: (it: (desc: string, testFn: () => Promise<void> | void) => void) => void) {
        const tests: { description: string; fn: () => Promise<void> | void }[] = [];
        fn((desc, testFn) => tests.push({ description: desc, fn: testFn }));
        this.suites.push({ name, tests });
    }

    async runAll(): Promise<Record<string, TestResult[]>> {
        const results: Record<string, TestResult[]> = {};

        for (const suite of this.suites) {
            results[suite.name] = [];
            for (const test of suite.tests) {
                const start = performance.now();
                try {
                    await test.fn();
                    results[suite.name].push({
                        description: test.description,
                        passed: true,
                        duration: performance.now() - start
                    });
                } catch (e: any) {
                    console.error(`Test Failed: [${suite.name}] ${test.description}`, e);
                    results[suite.name].push({
                        description: test.description,
                        passed: false,
                        error: e.message || 'Unknown error',
                        duration: performance.now() - start
                    });
                }
            }
        }
        return results;
    }
}

export const expect = (actual: any) => ({
    toBe: (expected: any) => {
        if (actual !== expected) throw new Error(`Expected '${expected}', but got '${actual}'`);
    },
    toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
    },
    toBeTruthy: () => {
        if (!actual) throw new Error(`Expected truthy, got ${actual}`);
    },
    toBeDefined: () => {
        if (actual === undefined || actual === null) throw new Error(`Expected value to be defined`);
    },
    toBeGreaterThan: (expected: number) => {
        if (typeof actual !== 'number' || actual <= expected) {
            throw new Error(`Expected > ${expected}, got ${actual}`);
        }
    },
    toContain: (item: any) => {
        if (!Array.isArray(actual) && typeof actual !== 'string') {
             throw new Error(`Expected array or string, got ${typeof actual}`);
        }
        if (!actual.includes(item)) {
            throw new Error(`Expected collection to contain '${item}'`);
        }
    },
    toMatchObject: (subset: any) => {
        for (const key in subset) {
            if (actual[key] !== subset[key]) {
                throw new Error(`Expected property '${key}' to be '${subset[key]}', but got '${actual[key]}'`);
            }
        }
    }
});
