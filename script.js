
let submitQuiz = document.getElementById("submitQuiz");

if (submitQuiz) {

    submitQuiz.addEventListener("click", function () {

        let answers = {
            q1: "New Delhi",
            q2: "Mars",
            q3: "7"
        };

        let score = 0;

        let totalQuestions = Object.keys(answers).length;

        for (let question in answers) {

            let selected = document.querySelector(
                `input[name="${question}"]:checked`
            );

            if (selected && selected.value === answers[question]) {
                score++;
            }
        }

        sessionStorage.setItem("quizScore", score);
        sessionStorage.setItem("totalQuestions", totalQuestions);

        window.location.href = "result.html";

    });

}

let scoreElement = document.getElementById("score");

if (scoreElement) {

    let score = sessionStorage.getItem("quizScore");
    let total = sessionStorage.getItem("totalQuestions");

    scoreElement.textContent = score + "/" + total;

    let message = document.getElementById("resultMessage");

    if (Number(score) === Number(total)) {
        message.textContent = "Excellent!";
    }
    else if (Number(score) >= 2) {
        message.textContent = "Good Job!";
    }
    else {
        message.textContent = "Keep Practicing!";
    }

}

// USER REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;

        try {

            const response = await fetch("http://localhost:5000/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (response.ok) {

                alert("Registration Successful!");

                registerForm.reset();

                window.location.href = "login.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Registration Error:", error);

            alert("Server connection failed. Please try again.");

        }

    });

}

// USER LOGIN

// USER LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login Successful!");

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data.user)
                );

                window.location.href = "user-dashboard.html";

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Login Error:", error);
            alert("Server connection failed. Please try again.");
        }
    });
}


// PROFILE MANAGEMENT
const profileForm = document.getElementById("profileForm");

if (profileForm) {

    // Load logged-in user details
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) {
        alert("Please login first!");
        window.location.href = "login.html";
    } else {

        const user = JSON.parse(userData);

        document.getElementById("profileName").value = user.name;
        document.getElementById("profileEmail").value = user.email;

        // Update Profile
        profileForm.addEventListener("submit", async function(event) {

            event.preventDefault();

            const name = document.getElementById("profileName").value.trim();
            const email = document.getElementById("profileEmail").value.trim();

            try {
                const response = await fetch("http://localhost:5000/api/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: user.id,
                        name: name,
                        email: email
                    })
                });

                const data = await response.json();

                if (response.ok) {

                    alert("Profile Updated Successfully!");

                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify(data.user)
                    );

                    document.querySelector(".profile-avatar").textContent =
                        name.charAt(0).toUpperCase();

                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Profile Error:", error);
                alert("Server connection failed!");
            }

        });
    }
}

// ADMIN ADD CATEGORY
const categoryForm = document.getElementById("categoryForm");

if (categoryForm) {

    categoryForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("categoryName").value.trim();

        try {

            const response = await fetch("http://localhost:5000/api/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Category Added Successfully!");
                categoryForm.reset();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Category Error:", error);
            alert("Server connection failed!");
        }

    });

}

// VIEW QUIZ CATEGORIES

const categoryGrid = document.getElementById("categoryGrid");

if (categoryGrid) {

    async function loadCategories() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/categories"
            );

            const categories = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load categories");
            }

            categoryGrid.innerHTML = "";

            if (categories.length === 0) {
                categoryGrid.innerHTML =
                    "<p>No categories available.</p>";
                return;
            }

            categories.forEach(function(category) {

                const card = document.createElement("div");
                card.className = "category-card";

                const heading = document.createElement("h2");
                heading.textContent = category.name;

                const description = document.createElement("p");
                description.textContent =
                    category.description ||
                    "Explore this quiz category and test your knowledge.";

                const link = document.createElement("a");
                link.href =
                    "quiz.html?categoryId=" +
                    encodeURIComponent(category._id);

                link.className = "start-quiz-btn";
                link.textContent = "Start Quiz →";

                card.appendChild(heading);
                card.appendChild(description);
                card.appendChild(link);

                categoryGrid.appendChild(card);

            });

        } catch (error) {

            console.log("Category Loading Error:", error);

            categoryGrid.innerHTML =
                "<p>Unable to load categories. Please try again.</p>";

        }
    }

    loadCategories();
}

// ADMIN UPDATE CATEGORY

const updateCategoryTable = document.getElementById("updateCategoryTable");

if (updateCategoryTable) {

    async function loadUpdateCategories() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/categories"
            );

            const categories = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load categories");
            }

            updateCategoryTable.innerHTML = "";

            if (categories.length === 0) {
                updateCategoryTable.innerHTML = `
                    <tr>
                        <td colspan="3">No categories found.</td>
                    </tr>
                `;
                return;
            }

            categories.forEach(function(category, index) {

                const row = document.createElement("tr");

                const numberCell = document.createElement("td");
                numberCell.textContent = String(index + 1).padStart(2, "0");

                const nameCell = document.createElement("td");
                nameCell.textContent = category.name;

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.className = "edit-category-btn";
                editButton.textContent = "Edit";

                editButton.addEventListener("click", async function() {

                    const newName = prompt(
                        "Enter updated category name:",
                        category.name
                    );

                    if (newName === null) return;

                    if (!newName.trim()) {
                        alert("Category name cannot be empty!");
                        return;
                    }

                    try {

                        const updateResponse = await fetch(
                            `http://localhost:5000/api/category/${category._id}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    name: newName.trim()
                                })
                            }
                        );

                        const data = await updateResponse.json();

                        if (updateResponse.ok) {
                            alert("Category Updated Successfully!");
                            loadUpdateCategories();
                        } else {
                            alert(data.message);
                        }

                    } catch (error) {
                        console.log("Update Error:", error);
                        alert("Server connection failed!");
                    }

                });

                actionCell.appendChild(editButton);

                row.appendChild(numberCell);
                row.appendChild(nameCell);
                row.appendChild(actionCell);

                updateCategoryTable.appendChild(row);

            });

        } catch (error) {

            console.log("Category Loading Error:", error);

            updateCategoryTable.innerHTML = `
                <tr>
                    <td colspan="3">Unable to load categories.</td>
                </tr>
            `;

        }
    }

    loadUpdateCategories();
}

// ADMIN DELETE CATEGORY

const deleteCategoryTable = document.getElementById("deleteCategoryTable");

if (deleteCategoryTable) {

    async function loadDeleteCategories() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/categories"
            );

            const categories = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load categories");
            }

            deleteCategoryTable.innerHTML = "";

            if (categories.length === 0) {
                deleteCategoryTable.innerHTML = `
                    <tr>
                        <td colspan="3">No categories available.</td>
                    </tr>
                `;
                return;
            }

            categories.forEach(function(category, index) {

                const row = document.createElement("tr");

                const numberCell = document.createElement("td");
                numberCell.textContent = String(index + 1).padStart(2, "0");

                const nameCell = document.createElement("td");
                nameCell.textContent = category.name;

                const actionCell = document.createElement("td");

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-category-btn";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async function() {

                    const confirmDelete = confirm(
                        `Are you sure you want to delete "${category.name}"?`
                    );

                    if (!confirmDelete) return;

                    try {

                        const deleteResponse = await fetch(
                            `http://localhost:5000/api/category/${category._id}`,
                            {
                                method: "DELETE"
                            }
                        );

                        const data = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert("Category Deleted Successfully!");
                            loadDeleteCategories();
                        } else {
                            alert(data.message);
                        }

                    } catch (error) {
                        console.log("Delete Error:", error);
                        alert("Server connection failed!");
                    }

                });

                actionCell.appendChild(deleteButton);

                row.appendChild(numberCell);
                row.appendChild(nameCell);
                row.appendChild(actionCell);

                deleteCategoryTable.appendChild(row);

            });

        } catch (error) {

            console.log("Category Loading Error:", error);

            deleteCategoryTable.innerHTML = `
                <tr>
                    <td colspan="3">Unable to load categories.</td>
                </tr>
            `;

        }
    }

    loadDeleteCategories();
}

// ADMIN ADD QUESTION

const addQuestionForm = document.getElementById("addQuestionForm");

if (addQuestionForm) {

    const categorySelect = document.getElementById("questionCategory");

    // LOAD CATEGORIES
    async function loadQuestionCategories() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/categories"
            );

            const categories = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load categories");
            }

            categorySelect.innerHTML =
                '<option value="">Select Category</option>';

            categories.forEach(function(category) {

                const option = document.createElement("option");

                option.value = category._id;
                option.textContent = category.name;

                categorySelect.appendChild(option);

            });

        } catch (error) {

            console.log("Category Error:", error);

            categorySelect.innerHTML =
                '<option value="">Unable to load categories</option>';

        }
    }

    loadQuestionCategories();


    // SAVE QUESTION
    addQuestionForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const category = categorySelect.value;

        const question = document.getElementById("questionText").value.trim();

        const options = [
            document.getElementById("optionA").value.trim(),
            document.getElementById("optionB").value.trim(),
            document.getElementById("optionC").value.trim(),
            document.getElementById("optionD").value.trim()
        ];

        const correctOption = document.getElementById("correctAnswer").value;

        const correctAnswer = options[
            ["A", "B", "C", "D"].indexOf(correctOption)
        ];

        if (new Set(options).size !== 4) {
            alert("Please enter four different options!");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/question",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        category,
                        question,
                        options,
                        correctAnswer
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Question Added Successfully!");

                addQuestionForm.reset();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Question Error:", error);

            alert("Server connection failed!");

        }

    });

}

// ADMIN UPDATE QUESTIONS

const updateQuestionTable = document.getElementById("questionsTableBody");

if (updateQuestionTable) {

    let questionList = [];
    let categoryList = [];

    async function loadQuestionsForUpdate() {

        try {
            const [questionResponse, categoryResponse] = await Promise.all([
                fetch("http://localhost:5000/api/questions"),
                fetch("http://localhost:5000/api/categories")
            ]);

            questionList = await questionResponse.json();
            categoryList = await categoryResponse.json();

            if (!questionResponse.ok || !categoryResponse.ok) {
                throw new Error("Failed to load data");
            }

            updateQuestionTable.innerHTML = "";

            if (questionList.length === 0) {
                updateQuestionTable.innerHTML =
                    '<tr><td colspan="4">No questions available.</td></tr>';
                return;
            }

            questionList.forEach(function(item, index) {

                const row = document.createElement("tr");

                const slNo = document.createElement("td");
                slNo.textContent = index + 1;

                const category = document.createElement("td");
                category.textContent = item.category
                    ? item.category.name
                    : "Unknown";

                const question = document.createElement("td");
                question.textContent = item.question;

                const action = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "question-edit-btn";

                editButton.addEventListener("click", function() {
                    editQuestion(item);
                });

                action.appendChild(editButton);

                row.append(slNo, category, question, action);

                updateQuestionTable.appendChild(row);
            });

        } catch (error) {
            console.log("Question Loading Error:", error);

            updateQuestionTable.innerHTML =
                '<tr><td colspan="4">Unable to load questions.</td></tr>';
        }
    }


    async function editQuestion(item) {

        const categoryNames = categoryList.map(function(category, index) {
            return (index + 1) + ". " + category.name;
        }).join("\n");

        const selectedCategory = prompt(
            "Select Category Number:\n" + categoryNames,
            item.category
                ? (categoryList.findIndex(c => c._id === item.category._id) + 1)
                : 1
        );

        if (selectedCategory === null) return;

        const categoryIndex = Number(selectedCategory) - 1;

        if (!Number.isInteger(categoryIndex) ||
            !categoryList[categoryIndex]) {
            alert("Invalid category selection!");
            return;
        }

        const question = prompt("Enter Question:", item.question);
        if (question === null) return;

        if (!question.trim()) {
            alert("Question cannot be empty!");
            return;
        }

        const options = [];

        for (let i = 0; i < 4; i++) {
            const option = prompt(
                "Enter Option " + String.fromCharCode(65 + i) + ":",
                item.options[i]
            );

            if (option === null) return;

            if (!option.trim()) {
                alert("All four options are required!");
                return;
            }

            options.push(option.trim());
        }

        if (new Set(options).size !== 4) {
            alert("Please enter four different options!");
            return;
        }

        const correctAnswer = prompt(
            "Enter the correct answer exactly as written in the options:\n" +
            options.join("\n"),
            item.correctAnswer
        );

        if (correctAnswer === null) return;

        if (!options.includes(correctAnswer.trim())) {
            alert("Correct answer must match one of the options!");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/question/" + item._id,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        category: categoryList[categoryIndex]._id,
                        question: question.trim(),
                        options: options,
                        correctAnswer: correctAnswer.trim()
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Question Updated Successfully!");
                loadQuestionsForUpdate();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Question Update Error:", error);
            alert("Server connection failed!");
        }
    }

    loadQuestionsForUpdate();
}

// ADMIN DELETE QUESTIONS

const deleteQuestionsTable = document.getElementById(
    "deleteQuestionsTableBody"
);

if (deleteQuestionsTable) {

    async function loadQuestionsForDelete() {

        try {
            const response = await fetch(
                "http://localhost:5000/api/questions"
            );

            const questions = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load questions");
            }

            deleteQuestionsTable.innerHTML = "";

            if (questions.length === 0) {
                deleteQuestionsTable.innerHTML =
                    '<tr><td colspan="4">No questions available.</td></tr>';
                return;
            }

            questions.forEach(function(item, index) {

                const row = document.createElement("tr");

                const slNo = document.createElement("td");
                slNo.textContent = index + 1;

                const category = document.createElement("td");
                category.textContent = item.category
                    ? item.category.name
                    : "Unknown";

                const question = document.createElement("td");
                question.textContent = item.question;

                const action = document.createElement("td");

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "question-delete-btn";

                deleteButton.addEventListener("click", async function() {

                    const confirmDelete = confirm(
                        "Are you sure you want to delete this question?"
                    );

                    if (!confirmDelete) return;

                    try {
                        const deleteResponse = await fetch(
                            "http://localhost:5000/api/question/" + item._id,
                            {
                                method: "DELETE"
                            }
                        );

                        const data = await deleteResponse.json();

                        if (deleteResponse.ok) {
                            alert("Question Deleted Successfully!");
                            loadQuestionsForDelete();
                        } else {
                            alert(data.message);
                        }

                    } catch (error) {
                        console.log("Delete Error:", error);
                        alert("Server connection failed!");
                    }
                });

                action.appendChild(deleteButton);

                row.append(slNo, category, question, action);

                deleteQuestionsTable.appendChild(row);
            });

        } catch (error) {
            console.log("Question Loading Error:", error);

            deleteQuestionsTable.innerHTML =
                '<tr><td colspan="4">Unable to load questions.</td></tr>';
        }
    }

    loadQuestionsForDelete();
}

// ADMIN VIEW REGISTERED USERS

const registeredUsersTable = document.getElementById(
    "registeredUsersTable"
);

if (registeredUsersTable) {

    async function loadRegisteredUsers() {

        try {
            const response = await fetch(
                "http://localhost:5000/api/users"
            );

            const users = await response.json();

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            registeredUsersTable.innerHTML = "";

            if (users.length === 0) {
                registeredUsersTable.innerHTML =
                    '<tr><td colspan="4">No registered users found.</td></tr>';
                return;
            }

            users.forEach(function(user, index) {

                const row = document.createElement("tr");

                const slNo = document.createElement("td");
                slNo.textContent = index + 1;

                const name = document.createElement("td");
                name.textContent = user.name;

                const email = document.createElement("td");
                email.textContent = user.email;

                const date = document.createElement("td");
                date.textContent = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "N/A";

                row.append(slNo, name, email, date);

                registeredUsersTable.appendChild(row);
            });

        } catch (error) {

            console.log("Users Loading Error:", error);

            registeredUsersTable.innerHTML =
                '<tr><td colspan="4">Unable to load users.</td></tr>';
        }
    }

    loadRegisteredUsers();
}

// ADMIN VIEW QUIZ RESULTS

const quizResultsTable = document.getElementById("quizResultsTable");

if (quizResultsTable) {

    async function loadQuizResults() {

        try {
            const response = await fetch(
                "http://localhost:5000/api/results"
            );

            const results = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load results");
            }

            quizResultsTable.innerHTML = "";

            if (results.length === 0) {
                quizResultsTable.innerHTML =
                    '<tr><td colspan="6">No quiz results available yet.</td></tr>';
                return;
            }

            results.forEach(function(item, index) {

                const row = document.createElement("tr");

                const slNo = document.createElement("td");
                slNo.textContent = index + 1;

                const userName = document.createElement("td");
                userName.textContent = item.user
                    ? item.user.name
                    : "Unknown User";

                const category = document.createElement("td");
                category.textContent = item.category
                    ? item.category.name
                    : "Unknown Category";

                const score = document.createElement("td");
                score.textContent = item.score;

                const total = document.createElement("td");
                total.textContent = item.totalQuestions;

                const date = document.createElement("td");
                date.textContent = new Date(item.createdAt)
                    .toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    });

                row.append(
                    slNo,
                    userName,
                    category,
                    score,
                    total,
                    date
                );

                quizResultsTable.appendChild(row);
            });

        } catch (error) {
            console.log("Results Loading Error:", error);

            quizResultsTable.innerHTML =
                '<tr><td colspan="6">Unable to load quiz results.</td></tr>';
        }
    }

    loadQuizResults();
}

// LOAD QUIZ QUESTIONS

const questionListContainer = document.getElementById("questionList");

if (questionListContainer) {

    async function loadQuizQuestions() {

        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("categoryId");

        if (!categoryId) {
            questionListContainer.textContent =
                "Please select a quiz category first.";
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/questions?categoryId=" +
                encodeURIComponent(categoryId)
            );

            const questions = await response.json();

            if (!response.ok) {
                throw new Error(questions.message);
            }

            questionListContainer.innerHTML = "";

            if (questions.length === 0) {
                questionListContainer.textContent =
                    "No questions available in this category.";
                return;
            }

            document.getElementById("quizCategoryTitle").textContent =
                questions[0].category.name + " Quiz";

            questions.forEach(function(item, index) {

                const questionDiv = document.createElement("div");
questionDiv.className = "question";
questionDiv.dataset.questionId = item._id;

                const heading = document.createElement("h3");
                heading.textContent =
                    (index + 1) + ". " + item.question;

                questionDiv.appendChild(heading);

                item.options.forEach(function(optionText) {

                    const label = document.createElement("label");
                    label.className = "option";

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = item._id;
                    radio.value = optionText;

                    const span = document.createElement("span");
                    span.textContent = optionText;

                    label.append(radio, span);
                    questionDiv.appendChild(label);

                });

                questionListContainer.appendChild(questionDiv);

            });

        } catch (error) {

            console.log("Quiz Loading Error:", error);

            questionListContainer.textContent =
                "Unable to load quiz questions. Please try again.";
        }
    }

    loadQuizQuestions();
}
// SUBMIT QUIZ
const submitQuizBtn = document.getElementById("submitQuiz");

if (submitQuizBtn) {
    submitQuizBtn.addEventListener("click", async function() {

        const userData = localStorage.getItem("loggedInUser");

        if (!userData) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userData);

        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("categoryId");

        const questionElements = document.querySelectorAll(
            "#questionList .question"
        );

        if (questionElements.length === 0) {
            alert("No questions available!");
            return;
        }

        const answers = [];

        for (const question of questionElements) {

            const selected = question.querySelector(
                'input[type="radio"]:checked'
            );

            if (!selected) {
                alert("Please answer all questions!");
                return;
            }

        answers.push({
    questionId: question.dataset.questionId,
    selectedAnswer: selected.value
});
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/quiz/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        categoryId: categoryId,
                        answers: answers
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                sessionStorage.setItem(
                    "quizScore",
                    data.score
                );

                sessionStorage.setItem(
                    "totalQuestions",
                    data.totalQuestions
                );

                sessionStorage.setItem(
                    "quizCategoryId",
                    categoryId
                );

                window.location.href = "result.html";

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Quiz Submit Error:", error);
            alert("Unable to submit quiz!");
        }
    });
}
// DISPLAY QUIZ RESULT
// DISPLAY QUIZ RESULT
const resultScoreElement = document.getElementById("score");

if (resultScoreElement) {

    const score = Number(sessionStorage.getItem("quizScore"));
    const total = Number(sessionStorage.getItem("totalQuestions"));

    if (
        sessionStorage.getItem("quizScore") === null ||
        sessionStorage.getItem("totalQuestions") === null
    ) {
        resultScoreElement.textContent = "0/0";

        document.getElementById("resultMessage").textContent =
            "No quiz result found!";

    } else {

        resultScoreElement.textContent = score + "/" + total;

        const percentage = (score / total) * 100;

        if (percentage === 100) {
            document.getElementById("resultMessage").textContent =
                "Excellent Performance!";

        } else if (percentage >= 70) {
            document.getElementById("resultMessage").textContent =
                "Great Job!";

        } else if (percentage >= 40) {
            document.getElementById("resultMessage").textContent =
                "Good Effort!";

        } else {
            document.getElementById("resultMessage").textContent =
                "Keep Practicing!";
        }
    }
}

// USER QUIZ HISTORY

const historyTableBody = document.getElementById("historyTableBody");

if (historyTableBody) {

    async function loadQuizHistory() {

        const userData = localStorage.getItem("loggedInUser");

        if (!userData) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        try {
            const user = JSON.parse(userData);
            const userId = user.id || user._id;

            if (!userId) {
                throw new Error("User ID not found. Please login again.");
            }

            const response = await fetch(
                "http://localhost:5000/api/results?userId=" +
                encodeURIComponent(userId)
            );

            const results = await response.json();

            if (!response.ok) {
                throw new Error(results.message || "Failed to load history");
            }

            historyTableBody.innerHTML = "";

            if (results.length === 0) {
                historyTableBody.innerHTML = `
                    <tr>
                        <td colspan="3">No quiz history found.</td>
                    </tr>
                `;
                return;
            }

            results.forEach(function(item) {

                const row = document.createElement("tr");

                const categoryCell = document.createElement("td");
                categoryCell.textContent = item.category
                    ? item.category.name
                    : "Unknown Category";

                const dateCell = document.createElement("td");

                dateCell.textContent = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "N/A";

                const scoreCell = document.createElement("td");

                const scoreBadge = document.createElement("span");
                scoreBadge.className = "score-badge";
                scoreBadge.textContent =
                    item.score + "/" + item.totalQuestions;

                scoreCell.appendChild(scoreBadge);

                row.append(
                    categoryCell,
                    dateCell,
                    scoreCell
                );

                historyTableBody.appendChild(row);

            });

        } catch (error) {

            console.log("Quiz History Error:", error);

            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="3">Unable to load quiz history.</td>
                </tr>
            `;
        }
    }

    loadQuizHistory();
}

// LOAD LEADERBOARD

const leaderboardTableBody = document.getElementById(
    "leaderboardTableBody"
);

if (leaderboardTableBody) {

    async function loadLeaderboard() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/leaderboard"
            );

            const users = await response.json();

            if (!response.ok) {
                throw new Error(
                    users.message || "Failed to load leaderboard"
                );
            }

            leaderboardTableBody.innerHTML = "";

            if (users.length === 0) {
                leaderboardTableBody.innerHTML = `
                    <tr>
                        <td colspan="4">No quiz results available yet.</td>
                    </tr>
                `;
                return;
            }

            users.forEach(function(user, index) {

                const row = document.createElement("tr");

                const rankCell = document.createElement("td");

                const rankBadge = document.createElement("span");
                rankBadge.className = "rank";

                if (index === 0) {
                    rankBadge.classList.add("first");
                } else if (index === 1) {
                    rankBadge.classList.add("second");
                } else if (index === 2) {
                    rankBadge.classList.add("third");
                }

                rankBadge.textContent = index + 1;
                rankCell.appendChild(rankBadge);

                const nameCell = document.createElement("td");
                nameCell.textContent = user.name;

                const quizCell = document.createElement("td");
                quizCell.textContent = user.quizzesAttended;

                const scoreCell = document.createElement("td");
                scoreCell.textContent = user.totalScore;

                row.append(
                    rankCell,
                    nameCell,
                    quizCell,
                    scoreCell
                );

                leaderboardTableBody.appendChild(row);

            });

        } catch (error) {

            console.log("Leaderboard Error:", error);

            leaderboardTableBody.innerHTML = `
                <tr>
                    <td colspan="4">Unable to load leaderboard.</td>
                </tr>
            `;
        }
    }

    loadLeaderboard();
}


const adminLoginForm = document.getElementById("adminLoginForm");

// ADMIN LOGIN
if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        const message = document.getElementById("adminLoginMessage");
        const button = adminLoginForm.querySelector("button");

        try {

            button.disabled = true;
            button.textContent = "Signing In...";

            const response = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            sessionStorage.setItem("adminLoggedIn", "true");

            message.style.color = "green";
            message.textContent = "Login successful!";

            setTimeout(function() {
                window.location.href = "admin-dashboard.html";
            }, 1000);

        } catch (error) {

            message.style.color = "red";
            message.textContent = error.message || "Login failed!";

        } finally {

            button.disabled = false;
            button.innerHTML = 'Sign In to Dashboard <span>→</span>';

        }

    });

}


// ADMIN PAGE PROTECTION
const currentPage = window.location.pathname.split("/").pop();

if (
    currentPage.startsWith("admin-") &&
    currentPage !== "admin-login.html"
) {

    const adminStatus = sessionStorage.getItem("adminLoggedIn");

    if (adminStatus !== "true") {

        alert("Please login as administrator first!");

        window.location.href = "admin-login.html";

    }

}

// USER DASHBOARD DATA
const userDashboard = document.querySelector(".user-dashboard");

if (userDashboard) {

    async function loadUserDashboard() {

        const userData = localStorage.getItem("loggedInUser");

        if (!userData) {
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        document.getElementById("dashboardUserName").textContent =
            "Welcome, " + user.name + "!";

        try {

            const response = await fetch(
                "http://localhost:5000/api/results?userId=" +
                encodeURIComponent(userId)
            );

            const results = await response.json();

            if (!response.ok) {
                throw new Error("Failed to load dashboard data");
            }

            // Total Quizzes
            document.getElementById("totalQuizzes").textContent =
                results.length;

            // Total Score
            const totalScore = results.reduce(function(total, item) {
                return total + Number(item.score || 0);
            }, 0);

            document.getElementById("totalScore").textContent =
                totalScore;

        } catch (error) {
            console.log("Dashboard Error:", error);
        }
    }

    loadUserDashboard();
}
// USER LOGOUT
const userLogout = document.getElementById("userLogout");

if (userLogout) {
    userLogout.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully!");

        window.location.href = "index.html";

    });
}