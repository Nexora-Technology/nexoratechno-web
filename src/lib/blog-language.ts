// WordPress has no language field for posts: each article is published twice
// (VI and EN) as separate posts. Vietnamese-only letters in the title decide.
// shortcut: title heuristic, upgrade to a WP language taxonomy if posts gain one.
const VIETNAMESE_LETTERS = /[ăâđêôơưàáạảãấầẩẫậắằẳẵặèéẹẻẽếềểễệìíỉịĩòóọỏõốồổỗộớờởỡợùúụủũứừửữựỳýỵỷỹ]/i;

export function postLanguage(title: string): 'vi' | 'en' {
  return VIETNAMESE_LETTERS.test(title) ? 'vi' : 'en';
}

/** Posts written in `locale`; falls back to all posts when none match, so a
 *  locale is never left empty just because a translation is missing. */
export function postsForLocale<T extends { title: string }>(posts: T[], locale: string): T[] {
  const matching = posts.filter((p) => postLanguage(p.title) === locale);
  return matching.length ? matching : posts;
}
