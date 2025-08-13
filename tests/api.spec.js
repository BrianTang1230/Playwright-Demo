import { test, expect } from "@playwright/test";

test("GET /users/1 Data", async ({ request }) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/users/1"
  );
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data.id).toBe(1);
  expect(data).toHaveProperty("name");
});

test("POST New Post", async ({ request }) => {
  const response = await request.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    }
  );

  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data).toHaveProperty("id");
});

test("PUT Updated Post", async ({ request }) => {
  const response = await request.put(
    "https://jsonplaceholder.typicode.com/posts/1",
    {
      data: {
        id: 1,
        title: "foo updated",
        body: "bar updated",
        userId: 1,
      },
    }
  );

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.title).toBe("foo updated");
});

test("PATCH Post Title", async ({ request }) => {
  const response = await request.patch(
    "https://jsonplaceholder.typicode.com/posts/1",
    {
      data: {
        title: "patched title",
      },
    }
  );

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.title).toBe("patched title");
});

test("DELETE 删除帖子", async ({ request }) => {
  const response = await request.delete(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  expect(response.status()).toBe(200);
});
