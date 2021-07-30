import { expect } from "chai";
import Branch from "../../src/wrapper-classes/branch";
import { allScenes } from "../scenes";
import { configureTest } from "../utils";

for (const scene of allScenes) {
  describe("Branch tests", function () {
    configureTest(this, scene);

    it("Can list git parent for a branch", () => {
      scene.repo.createChange("2");
      scene.repo.execCliCommand(`branch create "a" -s`);

      const branch = new Branch("a");
      expect(branch.getParentsFromGit()[0].name).to.equal("main");
    });

    it("Can list parent based on meta for a branch", () => {
      scene.repo.createChange("2");
      scene.repo.execCliCommand(`branch create "a" -s`);

      const branch = new Branch("a");
      expect(branch.getParentFromMeta()).is.not.undefined;
      expect(branch.getParentFromMeta()?.name).to.equal("main");
    });

    it("Can fetch branches that point to the same commit", () => {
      scene.repo.createAndCheckoutBranch("a");
      scene.repo.createChangeAndCommit("2");
      scene.repo.createAndCheckoutBranch("b");
      scene.repo.createAndCheckoutBranch("c");
      expect(
        new Branch("a")
          .branchesWithSameCommit()
          .map((b) => b.name)
          .sort()
          .join(", ")
      ).to.eq("b, c");
    });
  });
}
