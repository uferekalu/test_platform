const express = require("express");
const router = express.Router();
const Question = require("./models/Question");
const Category = require("./models/Category");
const Test = require("./models/Test");
const Result = require("./models/Results");
const jwt = require("jsonwebtoken");
const Results = require("./models/Results");

// get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// get one question
router.get("/questions/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const question = await Question.findOne({ _id });
    if (!question) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(question);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// create one question
router.post("/questions", async (req, res) => {
  try {
    const { description } = req.body;
    const { alternatives } = req.body;
    const { category } = req.body;

    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      // verify token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        const question = await Question.create({
          description,
          alternatives,
          category,
          createdBy,
        });
        return res.status(201).json(question);
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// update one question
router.put("/questions/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { description, alternatives, category } = req.body;

    let question = await Question.findOne({ _id });
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      // verify token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        if (!question) {
          question = await Question.create({
            description,
            alternatives,
            category,
            createdBy,
          });
          return res.status(201).json(question);
        } else {
          question.description = description;
          question.alternatives = alternatives;
          question.category = category;
          question.createdBy = createdBy;
          await question.save();
          return res.status(200).json(question);
        }
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// delete one question
router.delete("/questions/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const question = await Question.deleteOne({ _id });

    if (question.deletedCount === 0) {
      return res.status(404).json({ status: "failed" });
    } else {
      return res.status(204).json({ status: "success" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// create a category
router.post("/category", async (req, res) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        const category = await Category.create({
          name,
          createdBy,
        });
        return res.status(201).json(category);
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// update one category
router.put("/category/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { name } = req.body;

    let category_exist = await Category.findOne({ _id });

    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        if (!category_exist) {
          category_exist = await Category.create({
            name,
            createdBy,
          });
          return res.status(201).json(category_exist);
        } else {
          category_exist.name = name;
          category_exist.createdBy = createdBy;
          await category_exist.save();
          return res.status(200).json(category_exist);
        }
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get a category
router.get("/category/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const category = await Category.findOne({ _id });
    if (!category) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(category);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// delete one category
router.delete("/category/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const category = await Category.deleteOne({ _id });

    if (category.deletedCount === 0) {
      return res.status(404).json({ status: "failed" });
    } else {
      return res.status(204).json({ status: "success" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//create a test
router.post("/test", async (req, res) => {
  try {
    const { name, category, questions, passPercentage = 75, logo } = req.body;
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        const test = await Test.create({
          name,
          category,
          questions,
          passPercentage,
          createdBy,
        });
        return res.status(201).json(test);
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// update one test
router.put("/test/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, category, questions, passPercentage = 75, logo } = req.body;

    let test_exist = await Test.findOne({ _id });

    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const createdBy = user.id;
        if (!test_exist) {
          test_exist = await Test.create({
            name,
            category,
            questions,
            passPercentage,
            createdBy,
          });
          return res.status(201).json(test_exist);
        } else {
          test_exist.name = name;
          test_exist.category = category;
          test_exist.questions = questions;
          test_exist.passPercentage = passPercentage;
          test_exist.createdBy = createdBy;
          await test_exist.save();
          return res.status(200).json(test_exist);
        }
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get all tests
router.get("/tests", async (req, res) => {
  try {
    const tests = await Test.find();
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get a test
router.get("/test/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const test = await Test.findOne({ _id });
    if (!test) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(test);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// delete one category
router.delete("/test/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const category = await Test.deleteOne({ _id });

    if (category.deletedCount === 0) {
      return res.status(404).json({ status: "failed" });
    } else {
      return res.status(204).json({ status: "success" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// submit tests
router.post("/results/submit", async (req, res) => {
  try {
    const { test, answers, passPercentage = 75, attempt } = req.body;
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        const participant = user.id;
        const correctAnsweredCount = answers.filter(
          (answer) => answer.isCorrect
        ).length;
        const isPassed =
          Number((correctAnsweredCount / answers.length) * 100).toFixed(0) >=
          passPercentage;
        const result = await Result.create({
          user: participant,
          test,
          answers,
          passPercentage,
          attempt,
          isPassed,
          correctAnsweredCount,
          createdBy: participant,
        });
        return res.status(201).json(result);
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// get all results
router.get("/results", async (req, res) => {
  try {
    const results = await Results.find();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// get a result
router.get("/result/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const result = await Results.findOne({ _id });
    if (!result) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// this one is just a test
router.get("/", (req, res) => {
  res.send("HEll0 W0RlD");
});

module.exports = router;
