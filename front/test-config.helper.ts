import { TestBed } from '@angular/core/testing';

type CompilerOptions = Partial<{
  providers: any[];
  useJit: boolean;
  preserveWhitespaces: boolean;
}>;

export type ConfigureFn = (testBed: typeof TestBed) => void;

export const configureTests = async (
  configure: ConfigureFn,
  compilerOptions: CompilerOptions = {},
): Promise<typeof TestBed> => {
  const compilerConfig: CompilerOptions = {
    preserveWhitespaces: false,
    ...compilerOptions,
  };

  TestBed.configureCompiler(compilerConfig);

  configure(TestBed);

  await TestBed.compileComponents();

  return TestBed;
};
