import { MySqlSelectQueryBuilder } from "../MySqlSelectQueryBuilder";

describe("MySqlSelectQueryBuilder TEST", () => {
  it("TEST", async () => {
    const result = await MySqlSelectQueryBuilder.getBuilder()
      .select([
        "ID:number",
        "O.ID AS id:number",
        "O.OrderName AS orderName",
        "O.TotalPrice AS totalPrice:number",
        "OI.OrderItemName AS orderItemName",
      ] as const)
      .from("Order AS O")
      .leftJoin("OrderItem AS OI")
      .on("O.ID = OI.OrderID")
      .where("O.OrderID = 1")
      .andWhere("O.OrderID IN (1,2,3,4,5)")
      .find();

    console.log(result[0].orderItemName);
    const n1: string = result[0].orderItemName;
    console.log(n1);

    const result2 = await MySqlSelectQueryBuilder.getBuilder()
      .select([
        "U.ID AS id:number",
        "U.UserName AS userName",
        "O.TotalPrice:number",
      ] as const)
      .from("UserInfo AS U")
      .innerJoin("Order AS O")
      .on("U.ID = O.UserID")
      .where("U.ID=123")
      .andWhere("O.TotalPrice > 3000")
      .findOne();

    const n1: number = result2.userName;

    console.log(result2);
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
      // .execute();
      .getQuery();

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
      .getQuery();
    // .execute();

    console.log(result);
  });
});
