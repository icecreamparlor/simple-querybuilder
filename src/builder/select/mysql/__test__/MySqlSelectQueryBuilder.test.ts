import { MySqlSelectQueryBuilder } from "../MySqlSelectQueryBuilder";

describe("MySqlSelectQueryBuilder TEST", () => {
  it("TEST", async () => {
    const result = await MySqlSelectQueryBuilder.getBuilder()
      .select([
        "O.ID AS id",
        "O.OrderName AS orderName",
        "O.TotalPrice AS totalPrice",
        "OI.OrderItemName AS orderItemName",
      ] as const)
      .from("Order AS O")
      .innerJoin("OrderItem AS OI")
      .on("O.ID = OI.OrderID")
      .where("O.OrderID = 1")
      .andWhere("O.OrderID IN (1,2,3,4,5)")
      .execute();

    console.log(result);
  });

  it("TEST2", async () => {
    const result = await MySqlSelectQueryBuilder.getBuilder()
      .select(["A.ID AS id", "A.OrderName AS orderName"] as const)
      .from(
        (qb) => `(
        ${qb
          .select(["O.OrderID AS id", "O.OrderName as orderName"] as const)
          .from("Order AS O")
          .where("O.ID IN (1,2,3)")
          .getQuery()}
      ) AS A`
      )
      .execute();
    // .getQuery();

    console.log(result);
  });

  it("TEST3", async () => {
    const result = await MySqlSelectQueryBuilder.getBuilder()
      .select(["A.ID AS id:number", "A.OrderName AS orderName"] as const)
      .from(
        (qb) => `(
        ${qb
          .select(["O.OrderID AS id", "O.OrderName AS orderName"] as const)
          .from("Order AS O")
          .where("O.ID IN (1,2,3)")
          .getQuery()}
      ) AS A`
      )
      .execute();

    console.log(result);
  });
});
