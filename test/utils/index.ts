import { paths2json } from "../../src/tasks/helpers";

describe("", () => {
  it("convert paths to json", () => {
    const paths = [
      "PepeForkToken",
      "mock/MockERC20",
      "mock/foo/Foo",
      "mock/foo/Bar",
    ];

    const result = paths2json({}, paths, "_");
    console.log(result);
  });

  it("convert paths to json with exists json", () => {
    const paths = [
      "PepeForkToken",
      "mock/MockERC20",
      "mock/foo/Foo",
      "mock/foo/Bar",
    ];

    const result = paths2json(
      { PepeForkToken: "0x1", mock: { foo: { Bar: "0x2" } } },
      paths,
      "_",
    );
    console.log(result);
  });
});
