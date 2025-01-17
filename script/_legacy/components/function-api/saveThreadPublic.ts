import { db } from "@/pages/api/db";

export type Comment = {
  createdAt: string | null;
  index: number;
  createdUserId: number;
  createdUserEmoji: string;
  content: string;
};

export default async function saveThreadPublic(
  commentList: Comment[],
  threadId: number | null,
  tagList: string[],
  title: string,
  mainCommentIndex: string,
  view: number,
  url: string,
  like?: number
) {
  // 1 insert <thread>
  const { createdUserId, content, createdAt, createdUserEmoji } = commentList[0];
  const { createdAt: modifiedAt } = commentList[commentList.length - 1];
  const secondUserId = commentList[1].createdUserId;
  // 날짜 포맷 변환

  const params = [
    createdUserId,
    content,
    "KR",
    createdAt,
    "someone-reponsed",
    commentList[commentList.length - 1].createdUserEmoji,
    commentList.length,
    commentList[commentList.length - 1].createdUserId,
    createdUserId,
    secondUserId,
    modifiedAt,
  ];

  if (threadId === null) {
    // 1-1 Insert
    const sql = `
    INSERT INTO thread (
        created_user_id, title, language,
        created_at, tag, thread_image,
        last_index, last_send_user_id, people_json, \`type\`, modified_at
    )
    VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, JSON_ARRAY(?, ?), 'letter', ?
    );
  `;
    const result1 = await db.query<{ insertId: number }>(sql, params);
    threadId = result1.insertId;
  } else {
    // 1-2 UPDATE
    const sql = `
    UPDATE thread SET
        created_user_id = ?,
        title = ?,
        language = ?,
        created_at = ?,
        tag = ?,
        thread_image = ?,
        last_index = ?,
        last_send_user_id = ?,
        people_json = JSON_ARRAY(?, ?),
        \`type\` = 'letter',
        modified_at = ?
    WHERE thread_id = ?;
  `;
    params.push(threadId);
    await db.query(sql, params);
  }

  // 2 insert all comment list <thread_index>
  const values = []; // query params
  let placeholders = []; // query

  for (let comment of commentList) {
    const createdAtDate = comment.createdAt;
    values.push(threadId, comment.content, comment.createdUserId, comment.index, createdAtDate, createdAtDate);
    placeholders.push("(?, ?, ?, ?, ?, ?)");
  }
  const sqlThreadIndex = `
        DELETE FROM thread_index WHERE thread_id = ${threadId};
        INSERT INTO thread_index ( thread_id, content, created_user_id, \`index\`, created_at, modified_at )
        VALUES ${placeholders.join(", ")}
    		`;
  await db.query(sqlThreadIndex, values);

  // 3 insert <thread_public>

  const tagStr = JSON.stringify(tagList);
  const sqlInsertPublicThread = `
      INSERT INTO thread_public (
          thread_id, last_index, profile_emoji, title,
          main_index, content, tag, created_user_id,
          created_at, person_like_count, person_dislike_count, view,
          modified_at
      )
      VALUES (?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?)
      ON DUPLICATE KEY UPDATE
          last_index = VALUES(last_index),
          profile_emoji = VALUES(profile_emoji),
          title = VALUES(title),
          main_index = VALUES(main_index),
          content = VALUES(content),
          tag = VALUES(tag),
          created_user_id = VALUES(created_user_id),
          created_at = VALUES(created_at),
          person_like_count = VALUES(person_like_count),
          person_dislike_count = VALUES(person_dislike_count),
          view = VALUES(view),
          modified_at = VALUES(modified_at);
    `;
  await db.query(sqlInsertPublicThread, [
    threadId,
    commentList.length,
    createdUserEmoji,
    title.slice(0, 255),
    mainCommentIndex,
    content,
    tagStr,
    createdUserId,
    createdAt || modifiedAt,
    like ? like : Math.floor(Math.random() * (view * 0.1 + 1)), //person_like_count
    0, //person_dislike_count
    view,
    modifiedAt,
  ]);

  // delete before-tag-list
  const query2 = `DELETE FROM thread_public_tag WHERE thread_id = ?;`;
  // insert tag-list
  const tagListValues: (number | null | string)[] = [];
  const tagListStr = tagList
    .map((t) => {
      tagListValues.push(threadId, t);
      return "(?, ?)";
    })
    .join(",");
  const query3 = `INSERT INTO thread_public_tag (thread_id, tag) VALUES ${tagListStr};`;
  const query4 = `INSERT IGNORE INTO thread_url (thread_id, url) VALUES(?, ?);`;
  //#region insert thread_url
  await db.query(query2 + query3 + query4, [threadId, ...tagListValues, threadId, url]);
  //#endregion
  return threadId;
}
