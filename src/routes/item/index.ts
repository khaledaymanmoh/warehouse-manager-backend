import { Router, Request, Response } from "express";
import executeQuery from "../../config/db/db-executer";

const itemRouter = Router();

itemRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await executeQuery("SELECT * FROM item");
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

itemRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await executeQuery(
      "SELECT * FROM item WHERE id = " + req.params.id
    );
    if (result.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.send(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

itemRouter.post("/", async (req: Request, res: Response) => {
  const {
    name,
    category_id,
    fragile,
    special_storage,
    company_id,
    price,
    storage_price,
  } = req.body;
  try {
    await executeQuery(
      `INSERT INTO item (name, category_id, fragile, special_storage, company_id, price, storage_price) VALUES ('${name}', ${category_id}, ${fragile}, ${special_storage}, ${company_id}, ${price}, ${storage_price})`
    );
    res.send({ message: "Item created" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

itemRouter.put("/:id", async (req: Request, res: Response) => {
  const {
    name,
    category_id,
    fragile,
    special_storage,
    company_id,
    price,
    storage_price,
  } = req.body;
  try {
    const result = await executeQuery(
      `UPDATE item SET name = '${name}', category_id = ${category_id}, fragile = ${fragile}, special_storage = ${special_storage}, company_id = ${company_id}, price = ${price}, storage_price = ${storage_price} WHERE id = ${req.params.id}`
    );
    if (result.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.send({ message: "Item updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

itemRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await executeQuery(
      "SELECT * FROM item WHERE id = " + req.params.id
    );
    if (result.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    await executeQuery("DELETE FROM item WHERE id = " + req.params.id);
    res.send({ message: "Item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default itemRouter;
