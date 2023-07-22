import { TBranchPRInfo } from '../../lib/engine/metadata_ref';

export interface PR extends Required<Pick<TBranchPRInfo, 'number' | 'base'>> {
  ref: string;
}
type Tree = Record<PR['ref'] | 'main', Array<PR>>;

abstract class StackCommentBodyBase {
  protected tree: Tree;
  protected comment: string;

  protected constructor(prs: Array<PR>) {
    this.tree = { main: [] };

    for (const pr of prs) {
      const deps = this.tree[pr.base];
      this.tree[pr.base] = [...deps, pr];
      this.tree[pr.ref] = [];
    }

    this.comment = 'Current dependencies on/for this PR:\n\n';
    this.comment += this.buildTreeComment('main');
    this.comment += '\nThis comment was autogenerated by Freephite.';
  }

  protected buildPRString(pr: PR): string {
    return `**PR #${pr.number}**`;
  }

  private buildTreeComment(pr: 'main' | PR, level = 0): string {
    let line = ' '.repeat(level * 2) + '* ';
    if (pr === 'main') {
      line += 'main:\n';
    } else {
      line += this.buildPRString(pr) + '\n';
    }

    const children = pr === 'main' ? this.tree['main'] : this.tree[pr.ref];

    return line.concat(
      children.map((c) => this.buildTreeComment(c, level + 1)).join('')
    );
  }
}

/**
 * External API for generating a comment from a PR stack
 *
 * const body = StackCommentBody.generate(prs: Array<PR>)
 * const withPointer = body.forPR(pr: PR);
 *
 */
export class StackCommentBody extends StackCommentBodyBase {
  public static generate(prs: Array<PR>): StackCommentBody {
    return new this(prs);
  }

  public forPR(pr: PR): string {
    const line = this.buildPRString(pr);
    const index = this.comment.indexOf(line);

    return (
      this.comment.slice(0, index + line.length) +
      ' 👈' +
      this.comment.slice(index + line.length)
    );
  }

  public toString(): string {
    return this.comment;
  }
}
