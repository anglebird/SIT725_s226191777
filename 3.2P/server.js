const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

// 提供 public 文件夹里的静态文件
app.use(express.static(path.join(__dirname, "public")));

// BMI GET API
app.get("/calculate-bmi", (req, res) => {
    const height = parseFloat(req.query.height);
    const weight = parseFloat(req.query.weight);

    if (!height || !weight || height <= 0 || weight <= 0) {
        return res.json({ error: "Invalid input" });
    }

    const bmi = weight / ((height / 100) * (height / 100));

    let status = "";
    if (bmi < 18.5) {
        status = "Underweight";
    } else if (bmi < 25) {
        status = "Normal";
    } else if (bmi < 30) {
        status = "Overweight";
    } else {
        status = "Obese";
    }

    res.json({
        bmi: bmi.toFixed(2),
        status: status
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`App listening at: http://localhost:${port}`);
});