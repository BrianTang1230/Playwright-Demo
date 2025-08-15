import { test, expect } from "@playwright/test";
const token =
  "lyeIrunY-2149ghq7s0q19wNagrJpqqUp-DUIrrzGSVSTomYcGtM6U2wYrA5xG1yJuQnizxf4Zqs4m4A3XAQjLlY2cqvWk3CcQi7F-mYYDi6eV5WPLj8cDgm1wXwcWO7GRujzCsm0eb2Tn5tFYhnQyqrUjU3gjUoiWSXMDPlq_77SqIjVnFP3XgGGLDbH4D5iTpMyfbFt17kCNbOcngQL78i1QiDEpWdXnDvdWP8mQs7ligKFHk1w-gRhS6wvwLgZvKnhc-nJv1r-P6NADMIzOs0LAlhGMwfYCKSjo8bSDXaHCG1Nx0n4zexyMc3t5DcdQ4G6F8M6vN9uWpwxQ3n4w7Fqf5V4pncQoV7zHjEw6BDGRiTGsYwhfvYz0kafykDUtW-hi06ukf_Tq2rT1g54bz0KP0";

test.describe.serial("Country API", () => {
  let ctryKey;

  test("Add new Country", async ({ request }) => {
    const response = await request.post(
      "https://qa.quarto.cloud/zmasterapi/odata/Country",
      {
        data: {
          CtryCode: "TEST123",
          CtryDesc: "Country Create",
          Active: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    expect([200, 201]).toContain(response.status());

    const res = await response.json();
    ctryKey = parseInt(res.CtryKey);
    console.log("Retrieved ctryKey:", ctryKey);
  });

  test("Get Country by CtryKey", async ({ request }) => {
    console.log("Using ctryKey:", ctryKey);
    const response = await request.get(
      `https://qa.quarto.cloud/zmasterapi/odata/Country?key=${ctryKey}&$format=json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    console.log(await response.json());
    expect(response.status()).toBe(200);
  });

  test("Get all Country", async ({ request }) => {
    const response = await request.get(
      "https://qa.quarto.cloud/zmasterapi/odata/Country?$orderby=CtryCode&$format=json&%24inlinecount=allpages&%24top=20&%24filter=Active%20eq%20true",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    console.log(await response.json());
    expect(response.status()).toBe(200);
  });
});
