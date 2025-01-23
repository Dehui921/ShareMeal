import fs from 'node:fs'

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //  throw new Error('Loading meals failed');
  return db.prepare('SELECT * FROM meals').all();
};

export function getMeal(slug) {

  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop(); //讀取副檔名
  const fileName = `${meal.slug}.${extension}`; //重新命名

  const stream = fs.createWriteStream(`public/images/${fileName}`);// 創建寫入流資料寫入指定的路徑
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed!');
    }
    meal.image = `/images/${fileName}`;

    db.prepare(`
        INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
        VALUES(
         @title,
         @summary,
         @instructions,
         @creator,
         @creator_email,
         @image,
         @slug
        )
      `).run(meal);
  });


}