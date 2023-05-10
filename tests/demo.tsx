import { render } from '@testing-library/react';
import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

function demoTest(npmName: string, Provider?) {
  beforeEach(() => {
    vi.useFakeTimers();
    // @ts-ignore
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  const baseDir = path.join(__dirname, '..');

  describe(`@alipay/${npmName}:`, () => {
    const npmSrcDir = path.join(baseDir, `./packages/${npmName}/src`);
    const dirs = fs.readdirSync(npmSrcDir);

    dirs.forEach((dir) => {
      // 支持 demos 下的所有非_开头的tsx文件
      const files = glob.sync(`${npmSrcDir}/${dir}/**/demos/**/[!_]*.tsx`);
      if (files.length === 0) return;

      describe(`<${dir} />`, () => {
        files.forEach((file) => {
          const demoName = file?.split('/').pop();

          if (!demoName) return;

          it(`renders ${demoName} correctly`, async () => {
            const Demo = await import(file);

            // console.log(`测试组件${dir} DEMO:${demoName}`);
            const wrapper = render(<Demo.default />, { wrapper: Provider });
            act(() => {
              vi.runAllTimers();
            });

            expect(wrapper.container).toMatchSnapshot();
            wrapper.unmount();
          });
        });
      });
    });
  });
}

export default demoTest;