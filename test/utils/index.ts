import { paths2json } from "../../src/tasks/helpers";

describe("", () => {
  it("convert contracts to json", () => {
    const contracts: { name: string; path: string[] }[] = [
      {
        name: "Foo",
        path: ["mock", "foo", "Foo"],
      },
      {
        name: "Bar",
        path: ["Bar"],
      },
      {
        name: "Zoo",
        path: ["mock", "Zoo"],
      },
    ];

    const result = paths2json({}, contracts, "_");
    console.log(result);
  });

  it("convert paths to json with exists json", () => {
    const contracts: { name: string; path: string[] }[] = [
      {
        name: "Foo",
        path: ["mock", "foo", "Foo"],
      },
      {
        name: "Bar",
        path: ["Bar"],
      },
      {
        name: "Zoo",
        path: ["mock", "Zoo"],
      },
    ];

    const result = paths2json(
      { Bar: "0x1", mock: { foo: { Foo: "0x2" }, Zoo: "0x3" } },
      contracts,
      "_",
    );
    console.log(result);
  });
});
