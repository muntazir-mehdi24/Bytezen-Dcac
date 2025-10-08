import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlay, FaCheckCircle, FaLock, FaRegClock, FaChartLine, FaTasks, FaUserTie, FaBook, FaCertificate, FaBars, FaQuestionCircle, FaClipboardList, FaCalendarCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../../components/CodeBlock';
import { courseAPI, progressAPI } from '../../services/api';
import { useAuth } from '../../context/FirebaseAuthContext';
import AttendanceTab from '../../components/course/AttendanceTab';
import AttendanceManagement from '../../components/course/AttendanceManagement';

// Sample course data - in a real app, this would come from an API
const aiMLCourse = {
    id: 1,
    title: 'AI/ML Mastery',
    description: 'Master machine learning algorithms and AI concepts with Python.',
    category: 'AI/ML',
    duration: '24 weeks',
    level: 'Advanced',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    image: '/ai-ml-course.jpg',
    modules: [
      {
        id: 'week-1',
        title: 'Week 1: Getting Started with Python',
        duration: '7 days',
        lessons: [
          { 
            id: '1-0', 
            title: 'Week 1: Course Plan', 
            duration: '1 Article',
            type: 'article',
            completed: false,
            content: `
# Week 1: Course Plan

Welcome to Week 1 of your Data Science journey! This week sets the programming foundation you'll rely on throughout your course. You'll start by setting up Python and understanding how it works, then build your skills with variables, data types, control flow, functions and data structures. By the end of the week, you'll be comfortable writing clean, efficient Python code with practical features like file handling, OOP and decorators.

## Day 1 – Installation, Input/Output and Variables

Start from scratch by installing Python and writing your first few lines of code.

- Install Python and set up your environment
- Understand basic input and output operations
- Learn about variables and naming conventions
- Get introduced to Python keywords

## Day 2 – Data Types, Operators and Conditionals

Dive into how Python stores data and processes logic.

- Understand built-in data types like int, float, string, bool
- Use arithmetic, comparison and logical operators
- Write conditional programs using if, elif and else

## Day 3 – Loops, Functions and Lambda

Automate repetition and reuse code with loops and functions.

- Use for and while loops to iterate through data
- Learn how to define and call functions
- Explore lambda functions and understand when to use them

## Day 4 – Strings and Lists

Start working with sequences, two of Python's most used data types.

- Manipulate strings and use built-in string methods
- Learn list creation, indexing, slicing and common list operations

## Day 5 – Tuples, Sets and Dictionaries

Expand your toolkit with more advanced Python data structures.

- Understand immutability with tuples
- Explore unique-value storage using sets
- Create and manipulate key-value pairs with dictionaries

## Day 6 – Collections, Comprehensions and OOP

Make your Python code more efficient and organized.

- Learn specialized container types from the collections module
- Write one-liner logic with list, set and dictionary comprehensions
- Get introduced to Object-Oriented Programming in Python

## Day 7 – Exception Handling, File I/O and Advanced Python

Wrap up the week with advanced, real-world coding skills.

- Handle runtime errors with try, except, finally
- Work with files: read, write and manipulate text files
- Explore useful features: generators, decorators, context managers and a basic intro to APIs
`
          },
          { 
            id: '1-1', 
            title: 'Day 1: Introduction & Python Setup', 
            duration: '5 Articles • 5 Problems • 10 MCQs',
            type: 'day',
            completed: false,
            articles: [
              {
                id: '1-1-a1',
                title: 'What is Data Science?',
                completed: false,
                content: `# What is Data Science?

Data science is the study of data that helps us derive useful insight for business decision making. Data Science is all about using tools, techniques, and creativity to uncover insights hidden within data. It combines math, computer science, and domain expertise to tackle real-world challenges in a variety of fields.

Data Science processes the raw data and solve business problems and even make prediction about the future trend or requirement. For example, from the huge raw data of a company, data science can help answer following question:

- What do customer want?
- How can we improve our services?
- What will the upcoming trend in sales?
- How much stock they need for upcoming festival.

## Data Science Process

In short, data science empowers the industries to make smarter, faster, and more informed decisions. In order to find patterns and achieve such insights, expertise in relevant domain is required. With expertise in Healthcare, a data scientists can predict patient risks and suggest personalized treatments.

Data science involves these key steps:

- **Data Collection**: Gathering raw data from various sources, such as databases, sensors, or user interactions.
- **Data Cleaning**: Ensuring the data is accurate, complete, and ready for analysis.
- **Data Analysis**: Applying statistical and computational methods to identify patterns, trends, or relationships.
- **Data Visualization**: Creating charts, graphs, and dashboards to present findings clearly.
- **Decision-Making**: Using insights to inform strategies, create solutions, or predict outcomes.

## Increasing Demand of Data Science

Data Science is most promising and high in-demand career path. Given the massive amount of data rapidly increasing in every industry, demand of data scientists is expected to grow further by 35% in 2025. Today's data science is not limited to only analyzing data, or understanding past trends. Empowered with AI, ML and other advanced techniques, data science can solve real-word problems and train advance systems without human intervention.

## Why Is Data Science Important?

In a world flooded with user-data, data science is crucial for driving progress and innovation in every industry. Here are some key reasons why it is so important:

- **Helps Business in Decision-Making**: By analyzing data, businesses can understand trends and make informed choices that reduce risks and maximize profits.
- **Improves Efficiency**: Organizations can use data science to identify areas where they can save time and resources.
- **Personalizes Experiences**: Data science helps create customized recommendations and offers that improve customer satisfaction.
- **Predicts the Future**: Businesses can use data to forecast trends, demand, and other important factors.
- **Drives Innovation**: New ideas and products often come from insights discovered through data science.
- **Benefits Society**: Data science improves public services like healthcare, education, and transportation by helping allocate resources more effectively.

## Real Life Example of Data Science

There are lot of examples you can observe around yourself, where data science is being used. For Example - Social Media, Medical, Preparing strategy for Cricket or FIFA by analyzing past matches. Here are some more real life examples:

### Social Media Recommendation

Have you ever wondered why you always get Instagram Reels aligned towards your interest? These platforms uses data-science to Analyze your past interest/data (Like, Comments, watch etc) and create personalized recommendation to serve content that matches your interests.

### Early Diagnosis of Disease

Data Science can predicts the risk of conditions like diabetes or heart disease, by analyzing a patient's medical records and lifestyle habits. This allows doctors to act early and improve lives. In Future, it can help doctors detect diseases before symptoms even start to appear. For example, predicting a Tumor or Cancer at a very early stage. Data Science uses medical history and Image-data for such prediction.

### E-commerce recommendation and Demand Forecast

E-commerce platforms like Amazon or Flipkart use data science to enhance the shopping experience. By analyzing your browsing history, purchase behavior, and search patterns, they recommend products based on your preferences. It can also help in predicting demand for products by studying past sales trends, seasonal patterns etc.

## Applications of Data Science

Data science has a wide range of applications across various industries, by transforming how they operate and deliver results. Here are some examples:

- **Healthcare**: Data science is used to analyze patient data, predict diseases, develop personalized treatments, and optimize hospital operations.
- **Finance**: It helps detect fraudulent transactions, manage risks, and provide personalized financial advice.
- **Retail**: Businesses use data science to understand customer behavior, recommend products, optimize inventory, and improve supply chains.
- **Technology**: Data science powers innovations like search engines, virtual assistants, and recommendation systems.
- **Transportation**: It enables route optimization, traffic management, and predictive maintenance for vehicles.
- **Education**: Data science helps in designing personalized learning experiences, tracking student performance, and improving administrative efficiency.
- **Entertainment**: Streaming platforms and content creators use data science to recommend shows, analyze viewer preferences, and optimize content delivery.
- **Marketing**: Companies leverage data science to segment audiences, predict campaign outcomes, and personalize advertisements.

## Industry where data science is used

Data science is transforming every industry by unlocking the power of data. Here are some key sectors where data science plays a vital role:

- **Healthcare**: Data science improves patient outcomes by using predictive analytics to detect diseases early, creating personalized treatment plans and optimizing hospital operations for efficiency.
- **Finance**: Data science helps detect fraudulent activities, assess and manage financial risks, and provide tailored financial solutions to customers.
- **Retail**: Data science enhances customer experiences by delivering targeted marketing campaigns, optimizing inventory management, and forecasting sales trends accurately.
- **Technology**: Data science powers cutting-edge AI applications such as voice assistants, intelligent search engines, and smart home devices.
- **Transportation**: Data science optimizes travel routes, manages vehicle fleets effectively, and enhances traffic management systems for smoother journeys.
- **Manufacturing**: Data science predicts potential equipment failures, streamlines supply chain processes, and improves production efficiency through data-driven decisions.
- **Energy**: Data science forecasts energy demand, optimizes energy consumption, and facilitates the integration of renewable energy resources.
- **Agriculture**: Data science drives precision farming practices by monitoring crop health, managing resources efficiently, and boosting agricultural yields.

## Important Data Science Skills

Data Scientists need a mix of technical and soft skills to excel in this domain. To start with data science, it's important to learn the basics like Mathematics and Basic programming skills. Here are some essential skills for a successful career in data science:

- **Programming**: Proficiency in programming languages like Python, R, or SQL is crucial for analyzing and processing data effectively.
- **Statistics and Mathematics**: A strong foundation in statistics and linear algebra helps in understanding data patterns and building predictive models.
- **Machine Learning**: Knowledge of machine learning algorithms and frameworks is key to creating intelligent data-driven solutions.
- **Data Visualization**: The ability to present data insights through tools like Tableau, Power BI, or Matplotlib ensures findings are clear and actionable.
- **Data Wrangling**: Skills in cleaning, transforming, and preparing raw data for analysis are vital for maintaining data quality.
- **Big Data Tools**: Familiarity with tools like Hadoop, Spark, or cloud platforms helps in handling large datasets efficiently.
- **Critical Thinking**: Analytical skills to interpret data and solve problems creatively are essential for uncovering actionable insights.
- **Communication**: The ability to explain complex data findings in simple terms to stakeholders is a valuable asset.

Python and R language are widely used for data science. To learn data science effectively, we have curated step-wise guide for both:
- Data Science with Python
- Data Science With R

## How to Become a Data Scientist?

Data Science is a high demand career and opportunity in multiple growing industries. Let's discuss some key steps to becoming a successful data scientists:

1. **Learn Programming Skills**: Master essential programming languages like Python and R.
2. **Build a Strong Foundation First**: Study statistics, mathematics, and data structures.
3. **Start Machine Learning**: Learn algorithms, models, and frameworks for building AI solutions.
4. **Data Visualization Skills**: Use tools like Tableau or Power BI to present insights effectively.
5. **Gain Practical Experience along with Learning**: Work on projects, internships, or competitions to apply your knowledge.
6. **NLP and Deep Learning**: These are very important, after you finish above areas.
7. **Learn Big Data Tools**: Get familiar with Hadoop, Spark, and cloud computing platforms.
8. **Stay Updated with Trends**: Follow the latest trends and advancements in the field of data science.
9. **Network and Collaborate**: Join data science communities, attend meetups, and connect with professionals.

## Jobs and Career in Data Science

Here are some of the key data science job roles:

### 1. Data Scientist
**Responsibilities**: Analyzing large datasets, developing machine learning models, interpreting results, and providing insights to inform business decisions.

**Skills**: Proficiency in programming languages like Python or R, expertise in statistics and machine learning algorithms, data visualization skills, and domain knowledge in the relevant industry.

### 2. Data Analyst
**Responsibilities**: Collecting, cleaning, and analyzing data to identify trends, patterns, and insights. Often involves creating reports and dashboards to communicate findings to stakeholders.

**Skills**: Strong proficiency in SQL for data querying, experience with data visualization tools like Tableau or Power BI, basic statistical knowledge, and familiarity with Excel or Google Sheets.

### 3. Machine Learning Engineer
**Responsibilities**: Building and deploying machine learning models at scale, optimizing model performance, and integrating them into production systems.

**Skills**: Proficiency in programming languages like Python or Java, experience with machine learning frameworks like TensorFlow or PyTorch, knowledge of cloud platforms like AWS or Azure, and software engineering skills for developing scalable solutions.

### 4. Data Engineer
**Responsibilities**: Designing and building data pipelines to collect, transform, and store large volumes of data. Ensuring data quality, reliability, and scalability.

**Skills**: Expertise in database systems like SQL and NoSQL, proficiency in programming languages like Python or Java, experience with big data technologies like Hadoop or Spark, and knowledge of data warehousing concepts.

### 5. Business Intelligence (BI) Analyst
**Responsibilities**: Gathering requirements from business stakeholders, designing and developing BI reports and dashboards, and providing data-driven insights to support strategic decision-making.

**Skills**: Proficiency in BI tools like Tableau, Power BI, or Looker, strong SQL skills for data querying, understanding of data visualization principles, and ability to translate business needs into technical solutions.

### 6. Data Architect
**Responsibilities**: Designing the overall structure of data systems, including databases, data lakes, and data warehouses. Defining data models, schemas, and data governance policies.

**Skills**: Deep understanding of database technologies and architectures, experience with data modeling tools like ERWin or Visio, knowledge of data integration techniques, and familiarity with data security and compliance regulations.
`
              },
              {
                id: '1-1-a2',
                title: 'Getting Started with Python Programming',
                completed: false,
                content: `# Getting Started with Python Programming

Python is a versatile, interpreted programming language celebrated for its simplicity and readability. This guide will walk us through installing Python, running first program and exploring interactive coding—all essential steps for beginners.

## Install Python

Before starting this Python course first, you need to install Python on your computer. Most systems come with Python pre-installed. To verify if Python is available on your computer, simply open command line interface (Command Prompt on Windows or Terminal on macOS/Linux) and type:

\`\`\`bash
python --version
\`\`\`

If Python is installed, this command will display its version but if it is not installed then to install Python on our computer, follow these steps:

**Download Python**: Go to the official Python website at https://www.python.org/ On the homepage, we will see a "Downloads" section. Click on the "Download Python" button.

**Choose the Version**: We will be directed to a page where we can choose the version of Python we want to download. Python usually has two main versions available: Python 3. Python 3 is the recommended version. Click on the appropriate version for your operating system (Windows, macOS, or Linux).

**Add Python to PATH (Optional)**: On Windows, we may be given the option to add Python to our system's PATH environment variable. This makes it easier to run Python from the command line. If you're not sure, it's usually safe to select this option.

**Install Python**: Click the "Install Now" button to begin the installation. The installer will copy the necessary files to our computer.

**Verify the Installation**: After the installation is complete, we can verify if Python was installed correctly by opening cmd (on Windows) or terminal (on macOS or Linux). Type:

\`\`\`bash
python --version
\`\`\`

This should display the version of Python we installed.

### Step By Step Installation Guide:
- Install Python on Windows
- Install Python on Linux
- Install Python on MacOS

That's it! Python should now be installed on your computer, and you're ready to start using Python.

## Create and Run your First Python Program on Terminal

Once you have Python installed, you can run the program by following these steps:

1. Open a text editor (e.g., Notepad on Windows, TextEdit on macOS, or any code editor like VS Code, PyCharm, etc.).
2. Copy the code: \`print('Hello World')\` and paste it into the text editor.
3. Save the file with .py extension (e.g., Hello.py).
4. Open the terminal.
5. Run the program by pressing Enter.

You should see the output "Hello World" printed in the terminal.

## Using Python's Interactive Shell

For quick experiments, use Python's interactive shell:

### 1. Launch the Shell:
\`\`\`bash
python
\`\`\`

or, if required:
\`\`\`bash
python3
\`\`\`

### 2. Enter Commands Directly:
For example:
\`\`\`python
>>> print("Hello, World!")
\`\`\`

### 3. Exit the Shell:
\`\`\`python
exit()
\`\`\`

## Next Steps

With Python installed and your first script running, continue your journey by exploring:
- Variables and Data Types
- Loops and Conditional Statements
- Functions and Modules

Each step will help you build confidence and deepen your understanding of Python programming. While Learning Python, we will be using ByteZen code-editor present inside every tutorial, where you can learn and modify the code for practice. Let's see how to print Printing "Hello World" on online ide.

## Using Python on Google Colab

Google Colab is a popular cloud-based platform that provides an interactive Python environment for running Python code. It's especially useful for data science, machine learning, and educational purposes, as it allows you to write and execute Python code in the browser without installing anything locally.

### Steps to Get Started on Google Colab:

1. **Open Google Colab**: Go to Google Colab. You will need a Google account to access it.
2. **Create a New Notebook**: After logging into your Google account, you can create a new notebook by selecting File > New Notebook. This will create a fresh Python environment where you can start coding.
3. **Running Python Code**: In Colab, you can directly write Python code in cells and run them interactively. To run the code in a cell, click on the play button next to the cell or press Shift + Enter.

The above image shows how easily we can work with Python on Google colab.
`
              },
              {
                id: '1-1-a3',
                title: 'Input and Output in Python',
                completed: false,
                content: `# Input and Output in Python

Understanding input and output operations is fundamental to Python programming. With the print() function, we can display output in various formats, while the input() function enables interaction with users by gathering input during program execution.

## Taking input in Python

Python's input() function is used to take user input. By default, it returns the user input in form of a string.

**Example:**
\`\`\`python
name = input("Enter your name: ")
print("Hello,", name, "! Welcome!")
\`\`\`

**Output:**
\`\`\`
Enter your name: ByteZen
Hello, ByteZen ! Welcome!
\`\`\`

The code prompts the user to input their name, stores it in the variable "name" and then prints a greeting message addressing the user by their entered name.

To learn more about taking input, please refer: Taking Input in Python

## Printing Output using print() in Python

At its core, printing output in Python is straightforward, thanks to the print() function. This function allows us to display text, variables and expressions on the console. Let's begin with the basic usage of the print() function:

In this example, "Hello, World!" is a string literal enclosed within double quotes. When executed, this statement will output the text to the console.

\`\`\`python
print("Hello, World!")
\`\`\`

**Output:**
\`\`\`
Hello, World!
\`\`\`

## Printing Variables

We can use the print() function to print single and multiple variables. We can print multiple variables by separating them with commas. Example:

\`\`\`python
# Single variable
s = "Bob"
print(s)

# Multiple Variables
s = "Alice"
age = 25
city = "New York"
print(s, age, city)
\`\`\`

**Output:**
\`\`\`
Bob
Alice 25 New York
\`\`\`

## Take Multiple Input in Python

We are taking multiple input from the user in a single line, splitting the values entered by the user into separate variables for each value using the split() method. Then, it prints the values with corresponding labels, either two or three, based on the number of inputs provided by the user.

\`\`\`python
# taking two inputs at a time
x, y = input("Enter two values: ").split()
print("Number of boys: ", x)
print("Number of girls: ", y)

# taking three inputs at a time
x, y, z = input("Enter three values: ").split()
print("Total number of students: ", x)
print("Number of boys is : ", y)
print("Number of girls is : ", z)
\`\`\`

**Output:**
\`\`\`
Enter two values: 5 10
Number of boys:  5
Number of girls:  10
Enter three values: 5 10 15
Total number of students:  5
Number of boys is :  10
Number of girls is :  15
\`\`\`

## How to Change the Type of Input in Python

By default input() function helps in taking user input as string. If any user wants to take input as int or float, we just need to typecast it.

### Print Names in Python
The code prompts the user to input a string (the color of a rose), assigns it to the variable color and then prints the inputted color.

\`\`\`python
# Taking input as string
color = input("What color is rose?: ")
print(color)
\`\`\`

**Output:**
\`\`\`
What color is rose?: Red
Red
\`\`\`

### Print Numbers in Python
The code prompts the user to input an integer representing the number of roses, converts the input to an integer using typecasting and then prints the integer value.

\`\`\`python
# Taking input as int
# Typecasting to int
n = int(input("How many roses?: "))
print(n)
\`\`\`

**Output:**
\`\`\`
How many roses?: 88
88
\`\`\`

### Print Float/Decimal Number in Python
The code prompts the user to input the price of each rose as a floating-point number, converts the input to a float using typecasting and then prints the price.

\`\`\`python
# Taking input as float
# Typecasting to float
price = float(input("Price of each rose?: "))
print(price)
\`\`\`

**Output:**
\`\`\`
Price of each rose?: 50.30
50.30
\`\`\`

## Find DataType of Input in Python

In the given example, we are printing the type of variable x. We will determine the type of an object in Python.

\`\`\`python
a = "Hello World"
b = 10
c = 11.22
d = ("Python", "is", "Fun")
e = ["Python", "is", "Fun"]
f = {"Python": 1, "is":2, "Fun":3}

print(type(a))
print(type(b))
print(type(c))
print(type(d))
print(type(e))
print(type(f))
\`\`\`

**Output:**
\`\`\`
<class 'str'>
<class 'int'>
<class 'float'>
<class 'tuple'>
<class 'list'>
<class 'dict'>
\`\`\`
`
              },
              {
                id: '1-1-a4',
                title: 'Python Variables',
                completed: false,
                content: `# Python Variables

In Python, variables are used to store data that can be referenced and manipulated during program execution. A variable is essentially a name that is assigned to a value.

Unlike Java and many other languages, Python variables do not require explicit declaration of type.
The type of the variable is inferred based on the value assigned.

\`\`\`python
# Variable 'x' stores the integer value 10
x = 5

# Variable 'name' stores the string "Samantha"
name = "Samantha"

print(x)
print(name)
\`\`\`

**Output:**
\`\`\`
5
Samantha
\`\`\`

In this article, we'll explore the concept of variables in Python, including their syntax, characteristics and common operations.

## Rules for Naming Variables

To use variables effectively, we must follow Python's naming rules:

- Variable names can only contain letters, digits and underscores (_).
- A variable name cannot start with a digit.
- Variable names are case-sensitive (myVar and myvar are different).
- Avoid using Python keywords (e.g., if, else, for) as variable names.

**Valid:**
\`\`\`python
age = 21
_colour = "lilac"
total_score = 90
\`\`\`

**Invalid:**
\`\`\`python
1name = "Error"  # Starts with a digit
class = 10       # 'class' is a reserved keyword
user-name = "Doe"  # Contains a hyphen
\`\`\`

## Assigning Values to Variables

### Basic Assignment
Variables in Python are assigned values using the = operator.

\`\`\`python
x = 5
y = 3.14
z = "Hi"
\`\`\`

### Dynamic Typing
Python variables are dynamically typed, meaning the same variable can hold different types of values during execution.

\`\`\`python
x = 10
x = "Now a string"
\`\`\`

### Multiple Assignments
Python allows multiple variables to be assigned values in a single line.

### Assigning the Same Value
Python allows assigning the same value to multiple variables in a single line, which can be useful for initializing variables with the same value.

\`\`\`python
a = b = c = 100
print(a, b, c)
\`\`\`

**Output:**
\`\`\`
100 100 100
\`\`\`

### Assigning Different Values
We can assign different values to multiple variables simultaneously, making the code concise and easier to read.

\`\`\`python
x, y, z = 1, 2.5, "Python"
print(x, y, z)
\`\`\`

**Output:**
\`\`\`
1 2.5 Python
\`\`\`

## Type Casting a Variable

Type casting refers to the process of converting the value of one data type into another. Python provides several built-in functions to facilitate casting, including int(), float() and str() among others.

### Basic Casting Functions
- **int()** - Converts compatible values to an integer.
- **float()** - Transforms values into floating-point numbers.
- **str()** - Converts any data type into a string.

\`\`\`python
# Casting variables
s = "10"  # Initially a string
n = int(s)  # Cast string to integer
cnt = 5
f = float(cnt)  # Cast integer to float
age = 25
s2 = str(age)  # Cast integer to string

# Display results
print(n)
print(f)
print(s2)
\`\`\`

**Output:**
\`\`\`
10
5.0
25
\`\`\`

## Getting the Type of Variable

In Python, we can determine the type of a variable using the type() function. This built-in function returns the type of the object passed to it.

\`\`\`python
# Define variables with different data types
n = 42
f = 3.14
s = "Hello, World!"
li = [1, 2, 3]
d = {'key': 'value'}
bool = True

# Get and print the type of each variable
print(type(n))
print(type(f))
print(type(s))
print(type(li))
print(type(d))
print(type(bool))
\`\`\`

**Output:**
\`\`\`
<class 'int'>
<class 'float'>
<class 'str'>
<class 'list'>
<class 'dict'>
<class 'bool'>
\`\`\`

## Object Reference in Python

Let us assign a variable x to value 5.

\`\`\`python
x = 5
\`\`\`

When x = 5 is executed, Python creates an object to represent the value 5 and makes x reference this object.

Now, let's assign another variable y to the variable x.

\`\`\`python
y = x
\`\`\`

**Explanation:**
Python encounters the first statement, it creates an object for the value 5 and makes x reference it. The second statement creates y and references the same object as x, not x itself. This is called a Shared Reference, where multiple variables reference the same object.

Now, if we write:

\`\`\`python
x = 'ByteZen'
\`\`\`

Python creates a new object for the value "ByteZen" and makes x reference this new object.

**Explanation:** The variable y remains unchanged, still referencing the original object 5.

If we now assign a new value to y:

\`\`\`python
y = "Computer"
\`\`\`

Python creates yet another object for "Computer" and updates y to reference it.
The original object 5 no longer has any references and becomes eligible for garbage collection.

### Key Takeaways:
- Python variables hold references to objects, not the actual objects themselves.
- Reassigning a variable does not affect other variables referencing the same object unless explicitly updated.

## Delete a Variable Using del Keyword

We can remove a variable from the namespace using the del keyword. This effectively deletes the variable and frees up the memory it was using.

\`\`\`python
# Assigning value to variable
x = 10
print(x)

# Removing the variable using del
del x

# Trying to print x after deletion will raise an error
# print(x)  # Uncommenting this line will raise NameError: name 'x' is not defined
\`\`\`

**Explanation:**
- del x removes the variable x from memory.
- After deletion, trying to access the variable x results in a NameError, indicating that the variable no longer exists.

## Practical Examples

### 1. Swapping Two Variables
Using multiple assignments, we can swap the values of two variables without needing a temporary variable.

\`\`\`python
a, b = 5, 10
a, b = b, a
print(a, b)
\`\`\`

**Output:**
\`\`\`
10 5
\`\`\`

### 2. Counting Characters in a String
Assign the results of multiple operations on a string to variables in one line.

\`\`\`python
word = "Python"
length = len(word)
print("Length of the word:", length)
\`\`\`

**Output:**
\`\`\`
Length of the word: 6
\`\`\`
`
              },
              {
                id: '1-1-a5',
                title: 'Python Keywords',
                completed: false,
                content: `# Python Keywords

Keywords in Python are special reserved words that are part of the language itself. They define the rules and structure of Python programs, which means you cannot use them as names for your variables, functions, classes, or any other identifiers.

## Getting List of all Python keywords

We can also get all the keyword names using the below code.

\`\`\`python
import keyword

# printing all keywords at once using "kwlist()"
print("The list of keywords is : ")
print(keyword.kwlist)
\`\`\`

**Output:**
\`\`\`
The list of keywords are:
['False', 'None', 'True',"__peg_parser__ 'and', 'as', 'assert', 'async', 'await', 'break',
'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if',
'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
\`\`\`

## How to Identify Python Keywords?

1. **With Syntax Highlighting** - Most of IDEs provide syntax-highlight feature. You can see Keywords appearing in different color or style.
2. **Look for SyntaxError** - This error will encounter if you have used any keyword incorrectly. Note that keywords can not be used as identifiers (variable or a function name).

## What Happens if We Use Keywords as Variable Names?

If we attempt to use a keyword as a variable, Python will raise a SyntaxError. Let's look at an example:

\`\`\`python
for = 10
print(for)
\`\`\`

**Output:**
\`\`\`
Hangup (SIGHUP)
  File "/home/guest/sandbox/Solution.py", line 1
    for = 10
        ^
SyntaxError: invalid syntax
\`\`\`

## Python Keywords Categories

Let's categorize all keywords based on context for a more clear understanding.

| Category | Keywords |
|----------|----------|
| Value Keywords | True, False, None |
| Operator Keywords | and, or, not, is, in |
| Control Flow Keywords | if, else, elif, for, while, break, continue, pass, try, except, finally, raise, assert |
| Function and Class | def, return, lambda, yield, class |
| Context Management | with, as |
| Import and Module | import, from |
| Scope and Namespace | global, nonlocal |
| Async Programming | async, await |

## Keywords vs Identifiers

| Keywords | Identifiers |
|----------|-------------|
| Reserved words in Python that have a specific meaning. | Names given to variables, functions, classes, etc. |
| Cannot be used as variable names. | Can be used as variable names (if not a keyword). |
| Examples: if, else, for, while | Examples: x, number, sum, result |
| Part of the Python syntax. | User-defined, meaningful names in the code. |
| They cannot be redefined or changed. | Can be defined and redefined by the programmer. |

## Variables vs Keywords

| Variables | Keywords |
|-----------|----------|
| Used to store data. | Reserved words with predefined meanings in Python. |
| Can be created, modified, and deleted by the programmer. | Cannot be modified or used as variable names. |
| Examples: x, age, name | Examples: if, while, for |
| Hold values that are manipulated in the program. | Used to define the structure of Python code. |
| Variable names must follow naming rules but are otherwise flexible. | Fixed by Python language and cannot be altered. |
`
              }
            ],
            problems: [
              {
                id: 'input-in-python',
                title: 'Input In Python',
                completed: false,
                difficulty: 'Easy',
                points: 2
              },
              {
                id: 'hello-world-python',
                title: 'Hello World in Python',
                completed: false,
                difficulty: 'Easy',
                points: 1
              },
              {
                id: 'basic-input-output',
                title: 'Basic Input and Output',
                completed: false,
                difficulty: 'Easy',
                points: 2
              },
              {
                id: 'variable-assignment',
                title: 'Variable Assignment and Arithmetic',
                completed: false,
                difficulty: 'Easy',
                points: 2
              },
              {
                id: 'simple-calculator',
                title: 'Simple Calculator',
                completed: false,
                difficulty: 'Medium',
                points: 3
              }
            ],
            quiz: [
              {
                id: '1-1-q1',
                title: 'Quiz 1: Python Basics',
                completed: false,
                questions: 10
              }
            ]
          },
          { 
            id: '1-2', 
            title: 'Day 2: Data Types and Operators', 
            duration: '3 Articles • 6 Problems • 11 MCQs',
            type: 'day',
            completed: false,
            articles: [
              {
                id: '1-2-a1',
                title: 'Python Operators',
                completed: false,
                content: `# Python Operators

In Python programming, Operators in general are used to perform operations on values and variables.

- **Operators**: Special symbols like -, + , * , /, etc.
- **Operands**: Value on which the operator is applied.

## Types of Operators in Python

### Arithmetic Operators

Python Arithmetic operators are used to perform basic mathematical operations like addition, subtraction, multiplication and division.

In Python 3.x the result of division is a floating-point while in Python 2.x division of 2 integers was an integer. To obtain an integer result in Python 3.x floored (// integer) is used.

\`\`\`python
# Variables
a = 15
b = 4

# Addition
print("Addition:", a + b)  

# Subtraction
print("Subtraction:", a - b) 

# Multiplication
print("Multiplication:", a * b)  

# Division
print("Division:", a / b) 

# Floor Division
print("Floor Division:", a // b)  

# Modulus
print("Modulus:", a % b) 

# Exponentiation
print("Exponentiation:", a ** b)
\`\`\`

**Output:**
\`\`\`
Addition: 19
Subtraction: 11
Multiplication: 60
Division: 3.75
Floor Division: 3
Modulus: 3
Exponentiation: 50625
\`\`\`

**Note**: Refer to Differences between / and //.

### Comparison Operators

In Python, Comparison (or Relational) operators compares values. It either returns True or False according to the condition.

\`\`\`python
a = 13
b = 33

print(a > b)
print(a < b)
print(a == b)
print(a != b)
print(a >= b)
print(a <= b)
\`\`\`

**Output:**
\`\`\`
False
True
False
True
False
True
\`\`\`

### Logical Operators

Python Logical operators perform Logical AND, Logical OR and Logical NOT operations. It is used to combine conditional statements.

The precedence of Logical Operators in Python is as follows:
1. Logical not
2. logical and
3. logical or

\`\`\`python
a = True
b = False
print(a and b)
print(a or b)
print(not a)
\`\`\`

**Output:**
\`\`\`
False
True
False
\`\`\`

### Bitwise Operators

Python Bitwise operators act on bits and perform bit-by-bit operations. These are used to operate on binary numbers.

Bitwise Operators in Python are as follows:
- Bitwise NOT
- Bitwise Shift
- Bitwise AND
- Bitwise XOR
- Bitwise OR

\`\`\`python
a = 10
b = 4

print(a & b)
print(a | b)
print(~a)
print(a ^ b)
print(a >> 2)
print(a << 2)
\`\`\`

**Output:**
\`\`\`
0
14
-11
14
2
40
\`\`\`

### Assignment Operators

Python Assignment operators are used to assign values to the variables. This operator is used to assign the value of the right side of the expression to the left side operand.

**Example:**
\`\`\`python
a = 10
b = a
print(b)
b += a
print(b)
b -= a
print(b)
b *= a
print(b)
b <<= a
print(b)
\`\`\`

**Output:**
\`\`\`
10
20
10
100
102400
\`\`\`

### Identity Operators

In Python, **is** and **is not** are the identity operators both are used to check if two values are located on the same part of the memory. Two variables that are equal do not imply that they are identical.

- **is**: True if the operands are identical
- **is not**: True if the operands are not identical

\`\`\`python
a = 10
b = 20
c = a

print(a is not b)
print(a is c)
\`\`\`

**Output:**
\`\`\`
True
True
\`\`\`

### Membership Operators

In Python, **in** and **not in** are the membership operators that are used to test whether a value or variable is in a sequence.

- **in**: True if value is found in the sequence
- **not in**: True if value is not found in the sequence

\`\`\`python
x = 24
y = 20
list = [10, 20, 30, 40, 50]

if (x not in list):
    print("x is NOT present in given list")
else:
    print("x is present in given list")

if (y in list):
    print("y is present in given list")
else:
    print("y is NOT present in given list")
\`\`\`

**Output:**
\`\`\`
x is NOT present in given list
y is present in given list
\`\`\`

### Ternary Operator

In Python, Ternary operators also known as conditional expressions are operators that evaluate something based on a condition being true or false. It was added to Python in version 2.5.

It simply allows testing a condition in a single line replacing the multiline if-else, making the code compact.

**Syntax**: \`[on_true] if [expression] else [on_false]\`

\`\`\`python
a, b = 10, 20
min = a if a < b else b

print(min)
\`\`\`

**Output:**
\`\`\`
10
\`\`\`

## Precedence and Associativity of Operators

In Python, Operator precedence and associativity determine the priorities of the operator.

### Operator Precedence

This is used in an expression with more than one operator with different precedence to determine which operation to perform first.

\`\`\`python
expr = 10 + 20 * 30
print(expr)
name = "Alex"
age = 0

if name == "Alex" or name == "John" and age >= 2:
    print("Hello! Welcome.")
else:
    print("Good Bye!!")
\`\`\`

**Output:**
\`\`\`
610
Hello! Welcome.
\`\`\`

### Operator Associativity

If an expression contains two or more operators with the same precedence then Operator Associativity is used to determine. It can either be Left to Right or from Right to Left.

\`\`\`python
print(100 / 10 * 10)
print(5 - 2 + 3)
print(5 - (2 + 3))
print(2 ** 3 ** 2)
\`\`\`

**Output:**
\`\`\`
100.0
6
0
512
\`\`\`
`
              },
              {
                id: '1-2-a2',
                title: 'Python Data Types',
                completed: false,
                content: `# Python Data Types

Data types in Python are a way to classify data items. They represent the kind of value, which determines what operations can be performed on that data. Since everything is an object in Python programming, Python data types are classes and variables are instances (objects) of these classes.

The following are standard or built-in data types in Python:
- **Numeric**: int, float, complex
- **Sequence Type**: string, list, tuple
- **Mapping Type**: dict
- **Boolean**: bool
- **Set Type**: set, frozenset
- **Binary Types**: bytes, bytearray, memoryview

Below code assigns variable 'x' different values of few Python data types - int, float, list, tuple and string. Each assignment replaces previous value, making 'x' take on data type and value of most recent assignment.

\`\`\`python
x = 50  # int
x = 60.5  # float
x = "Hello World"  # string
x = ["python", "is", "fun"]  # list 
x = ("python", "is", "fun")  # tuple
\`\`\`

## 1. Numeric Data Types

Python numbers represent data that has a numeric value. A numeric value can be an integer, a floating number or even a complex number. These values are defined as int, float and complex classes.

- **Integers**: value is represented by int class. It contains positive or negative whole numbers (without fractions or decimals). There is no limit to how long an integer value can be.
- **Float**: value is represented by float class. It is a real number with a floating-point representation. It is specified by a decimal point. Optionally, character e or E followed by a positive or negative integer may be appended to specify scientific notation.
- **Complex Numbers**: It is represented by a complex class. It is specified as (real part) + (imaginary part)j. For example - 2+3j

\`\`\`python
a = 5
print(type(a))

b = 5.0
print(type(b))

c = 2 + 4j
print(type(c))
\`\`\`

**Output:**
\`\`\`
<class 'int'>
<class 'float'>
<class 'complex'>
\`\`\`

## 2. Sequence Data Types

A sequence is an ordered collection of items, which can be of similar or different data types. Sequences allow storing of multiple values in an organized and efficient fashion. There are several sequence data types of Python:

### String Data Type

Python Strings are arrays of bytes representing Unicode characters. In Python, there is no character data type, a character is a string of length one. It is represented by str class.

Strings in Python can be created using single quotes, double quotes or even triple quotes. We can access individual characters of a String using index.

\`\`\`python
s = 'Welcome to the ByteZen World'
print(s)

# check data type 
print(type(s))

# access string with index
print(s[1])
print(s[2])
print(s[-1])
\`\`\`

**Output:**
\`\`\`
Welcome to the ByteZen World
<class 'str'>
e
l
d
\`\`\`

### List Data Type

Lists are similar to arrays found in other languages. They are an ordered and mutable collection of items. It is very flexible as items in a list do not need to be of the same type.

#### Creating a List in Python

Lists in Python can be created by just placing sequence inside the square brackets[].

\`\`\`python
# Empty list
a = []

# list with int values
a = [1, 2, 3]
print(a)

# list with mixed values int and String
b = ["Python", "Java", "C++", 4, 5]
print(b)
\`\`\`

**Output:**
\`\`\`
[1, 2, 3]
['Python', 'Java', 'C++', 4, 5]
\`\`\`

#### Access List Items

In order to access the list items refer to index number. In Python, negative sequence indexes represent positions from end of the array. Instead of having to compute offset as in List[len(List)-3], it is enough to just write List[-3]. Negative indexing means beginning from end, -1 refers to last item, -2 refers to second-last item, etc.

\`\`\`python
a = ["Python", "Java", "C++"]
print("Accessing element from the list")
print(a[0])
print(a[2])

print("Accessing element using negative indexing")
print(a[-1])
print(a[-3])
\`\`\`

**Output:**
\`\`\`
Accessing element from the list
Python
C++
Accessing element using negative indexing
C++
Python
\`\`\`

### Tuple Data Type

Tuple is an ordered collection of Python objects. The only difference between a tuple and a list is that tuples are immutable. Tuples cannot be modified after it is created.

#### Creating a Tuple in Python

In Python, tuples are created by placing a sequence of values separated by a 'comma' with or without the use of parentheses for grouping data sequence. Tuples can contain any number of elements and of any datatype (like strings, integers, lists, etc.).

**Note**: Tuples can also be created with a single element, but it is a bit tricky. Having one element in the parentheses is not sufficient, there must be a trailing 'comma' to make it a tuple.

\`\`\`python
# initiate empty tuple
tup1 = ()

tup2 = ('Python', 'Java')
print("\nTuple with the use of String: ", tup2)
\`\`\`

**Output:**
\`\`\`
Tuple with the use of String:  ('Python', 'Java')
\`\`\`

**Note** - The creation of a Python tuple without the use of parentheses is known as Tuple Packing.

#### Access Tuple Items

In order to access tuple items refer to the index number. Use the index operator [ ] to access an item in a tuple.

\`\`\`python
tup1 = tuple([1, 2, 3, 4, 5])

# access tuple items
print(tup1[0])
print(tup1[-1])
print(tup1[-3])
\`\`\`

**Output:**
\`\`\`
1
5
3
\`\`\`

## 3. Boolean Data Type in Python

Python Boolean Data type is one of the two built-in values, True or False. Boolean objects that are equal to True are truthy (true) and those equal to False are falsy (false). However non-Boolean objects can be evaluated in a Boolean context as well and determined to be true or false. It is denoted by class bool.

\`\`\`python
print(type(True))
print(type(False))
print(type(true))
\`\`\`

**Output:**
\`\`\`
<class 'bool'>
<class 'bool'>
Traceback (most recent call last):
  File "/home/7e8862763fb66153d70824099d4f5fb7.py", line 8, in 
    print(type(true))
NameError: name 'true' is not defined
\`\`\`

## 4. Set Data Type in Python

In Python Data Types, Set is an unordered collection of data types that is iterable, mutable, and has no duplicate elements. The order of elements in a set is undefined though it may consist of various elements.

### Create a Set in Python

Sets can be created by using the built-in set() function with an iterable object or a sequence by placing the sequence inside curly braces, separated by a 'comma'. The type of elements in a set need not be the same, various mixed-up data type values can also be passed to the set.

\`\`\`python
# initializing empty set
s1 = set()

s1 = set("ByteZenPython")
print("Set with the use of String: ", s1)

s2 = set(["Python", "Java", "Python"])
print("Set with the use of List: ", s2)
\`\`\`

**Output:**
\`\`\`
Set with the use of String:  {'B', 'y', 't', 'e', 'Z', 'n', 'P', 'h', 'o'}
Set with the use of List:  {'Python', 'Java'}
\`\`\`

### Access Set Items

Set items cannot be accessed by referring to an index, since sets are unordered the items have no index. But we can loop through the set items using a for loop, or ask if a specified value is present in a set, by using the keyword in.

\`\`\`python
set1 = set(["Python", "Java", "Python"]) #Duplicates are removed automatically
print(set1) 

# loop through set
for i in set1:
   print(i, end=" ") #prints elements one by one
  
# check if item exist in set   
print("Python" in set1)
\`\`\`

**Output:**
\`\`\`
{'Java', 'Python'}
Java Python True
\`\`\`

## 5. Dictionary Data Type

A dictionary in Python is a collection of data values, used to store data values like a map, unlike other Python Data Types, a Dictionary holds a key: value pair. Key-value is provided in dictionary to make it more optimized. Each key-value pair in a Dictionary is separated by a colon : , whereas each key is separated by a 'comma'.

### Create a Dictionary in Python

Values in a dictionary can be of any datatype and can be duplicated, whereas keys can't be repeated and must be immutable. The dictionary can also be created by the built-in function dict().

**Note** - Dictionary keys are case sensitive, the same name but different cases of Key will be treated distinctly.

\`\`\`python
# initialize empty dictionary
d = {}

d = {1: 'Python', 2: 'Java', 3: 'C++'}
print(d)

# creating dictionary using dict() constructor
d1 = dict({1: 'Python', 2: 'Java', 3: 'C++'})
print(d1)
\`\`\`

**Output:**
\`\`\`
{1: 'Python', 2: 'Java', 3: 'C++'}
{1: 'Python', 2: 'Java', 3: 'C++'}
\`\`\`

### Accessing Key-value in Dictionary

In order to access items of a dictionary refer to its key name. Key can be used inside square brackets. Using get() method we can access dictionary elements.

\`\`\`python
d = {1: 'Python', 'name': 'Java', 3: 'C++'}

# Accessing an element using key
print(d['name'])

# Accessing a element using get
print(d.get(3))
\`\`\`

**Output:**
\`\`\`
Java
C++
\`\`\`
`
              },
              {
                id: '1-2-a3',
                title: 'Conditional Statements in Python',
                completed: false,
                content: `# Conditional Statements in Python

Conditional statements in Python are used to execute certain blocks of code based on specific conditions. These statements help control the flow of a program, making it behave differently in different situations.

## If Conditional Statement

If statement is the simplest form of a conditional statement. It executes a block of code if the given condition is true.

### If Statement

\`\`\`python
age = 20
if age >= 18:
    print("Eligible to vote.")
\`\`\`

**Output:**
\`\`\`
Eligible to vote.
\`\`\`

### Short Hand if

Short-hand if statement allows us to write a single-line if statement.

\`\`\`python
age = 19
if age > 18: print("Eligible to Vote.")
\`\`\`

**Output:**
\`\`\`
Eligible to Vote.
\`\`\`

This is a compact way to write an if statement. It executes print statement if the condition is true.

## If else Conditional Statement

If Else allows us to specify a block of code that will execute if the condition(s) associated with an if or elif statement evaluates to False. Else block provides a way to handle all other cases that don't meet the specified conditions.

### If Else Statement

\`\`\`python
age = 10
if age <= 12:
    print("Travel for free.")
else:
    print("Pay for ticket.")
\`\`\`

**Output:**
\`\`\`
Travel for free.
\`\`\`

### Short Hand if-else

The short-hand if-else statement allows us to write a single-line if-else statement.

\`\`\`python
marks = 45
res = "Pass" if marks >= 40 else "Fail"
print(f"Result: {res}")
\`\`\`

**Output:**
\`\`\`
Result: Pass
\`\`\`

**Note**: This method is also known as ternary operator. Ternary Operator essentially a shorthand for the if-else statement that allows us to write more compact and readable code, especially for simple conditions.

## elif Statement

elif statement in Python stands for "else if." It allows us to check multiple conditions, providing a way to execute different blocks of code based on which condition is true. Using elif statements makes our code more readable and efficient by eliminating the need for multiple nested if statements.

\`\`\`python
age = 25

if age <= 12:
    print("Child.")
elif age <= 19:
    print("Teenager.")
elif age <= 35:
    print("Young adult.")
else:
    print("Adult.")
\`\`\`

**Output:**
\`\`\`
Young adult.
\`\`\`

The code checks the value of age using if-elif-else. Since age is 25, it skips the first two conditions (age <= 12 and age <= 19), and the third condition (age <= 35) is True, so it prints "Young adult.".

## Nested if..else Conditional Statement

Nested if..else means an if-else statement inside another if statement. We can use nested if statements to check conditions within conditions.

### Nested If Else

\`\`\`python
age = 70
is_member = True

if age >= 60:
    if is_member:
        print("30% senior discount!")
    else:
        print("20% senior discount.")
else:
    print("Not eligible for a senior discount.")
\`\`\`

**Output:**
\`\`\`
30% senior discount!
\`\`\`

## Ternary Conditional Statement

A ternary conditional statement is a compact way to write an if-else condition in a single line. It's sometimes called a "conditional expression."

\`\`\`python
# Assign a value based on a condition
age = 20
s = "Adult" if age >= 18 else "Minor"
print(s)
\`\`\`

**Output:**
\`\`\`
Adult
\`\`\`

Here:
- If age >= 18 is True, status is assigned "Adult".
- Otherwise, status is assigned "Minor".

## Match-Case Statement

match-case statement is Python's version of a switch-case found in other languages. It allows us to match a variable's value against a set of patterns.

\`\`\`python
number = 2

match number:
    case 1:
        print("One")
    case 2 | 3:
        print("Two or Three")
    case _:
        print("Other number")
\`\`\`

**Output:**
\`\`\`
Two or Three
\`\`\`
`
              }
            ],
            problems: [
              {
                id: 'day2-problem-1',
                title: 'Type Checker',
                completed: false,
                difficulty: 'Easy',
                points: 2,
                description: 'Write a program that takes an input and prints its data type.',
                testCases: [
                  { input: '42', output: "<class 'int'>" },
                  { input: '3.14', output: "<class 'float'>" },
                  { input: 'Hello', output: "<class 'str'>" }
                ],
                starterCode: `# Take input from user
value = input()

# Convert to appropriate type and print its type
# Hint: Try converting to int first, then float, otherwise keep as string
`,
                solution: `value = input()
try:
    val = int(value)
    print(type(val))
except:
    try:
        val = float(value)
        print(type(val))
    except:
        print(type(value))`
              },
              {
                id: 'day2-problem-2',
                title: 'List Operations',
                completed: false,
                difficulty: 'Easy',
                points: 2,
                description: 'Create a list with elements [10, 20, 30, 40, 50]. Print the first element, last element, and the element at index 2.',
                testCases: [
                  { input: '', output: '10\n50\n30' }
                ],
                starterCode: `# Create the list
my_list = [10, 20, 30, 40, 50]

# Print first element


# Print last element


# Print element at index 2

`,
                solution: `my_list = [10, 20, 30, 40, 50]
print(my_list[0])
print(my_list[-1])
print(my_list[2])`
              },
              {
                id: 'day2-problem-3',
                title: 'Simple Calculator',
                completed: false,
                difficulty: 'Easy',
                points: 2,
                description: 'Take two numbers as input and print their sum, difference, product, and quotient (division).',
                testCases: [
                  { input: '10\n5', output: '15\n5\n50\n2.0' },
                  { input: '20\n4', output: '24\n16\n80\n5.0' }
                ],
                starterCode: `# Take two numbers as input
a = int(input())
b = int(input())

# Print sum, difference, product, and quotient




`,
                solution: `a = int(input())
b = int(input())
print(a + b)
print(a - b)
print(a * b)
print(a / b)`
              },
              {
                id: 'day2-problem-4',
                title: 'Even or Odd Checker',
                completed: false,
                difficulty: 'Medium',
                points: 3,
                description: 'Write a program that takes a number as input and prints "Even" if the number is even, otherwise prints "Odd". Use the modulus operator (%).',
                testCases: [
                  { input: '10', output: 'Even' },
                  { input: '7', output: 'Odd' },
                  { input: '0', output: 'Even' }
                ],
                starterCode: `# Take number as input
num = int(input())

# Check if even or odd using modulus operator

`,
                solution: `num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`
              },
              {
                id: 'day2-problem-5',
                title: 'Grade Calculator',
                completed: false,
                difficulty: 'Medium',
                points: 3,
                description: 'Take marks (0-100) as input and print grade: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60).',
                testCases: [
                  { input: '95', output: 'A' },
                  { input: '82', output: 'B' },
                  { input: '55', output: 'F' }
                ],
                starterCode: `# Take marks as input
marks = int(input())

# Determine and print grade using if-elif-else

`,
                solution: `marks = int(input())
if marks >= 90:
    print("A")
elif marks >= 80:
    print("B")
elif marks >= 70:
    print("C")
elif marks >= 60:
    print("D")
else:
    print("F")`
              },
              {
                id: 'day2-problem-6',
                title: 'Membership Test',
                completed: false,
                difficulty: 'Medium',
                points: 3,
                description: 'Create a list of fruits: ["apple", "banana", "cherry", "date"]. Take a fruit name as input and check if it exists in the list. Print "Found" or "Not Found".',
                testCases: [
                  { input: 'banana', output: 'Found' },
                  { input: 'mango', output: 'Not Found' },
                  { input: 'apple', output: 'Found' }
                ],
                starterCode: `# Create list of fruits
fruits = ["apple", "banana", "cherry", "date"]

# Take input
fruit = input()

# Check membership and print result

`,
                solution: `fruits = ["apple", "banana", "cherry", "date"]
fruit = input()
if fruit in fruits:
    print("Found")
else:
    print("Not Found")`
              }
            ],
            quiz: [
              {
                id: '1-2-q1',
                title: 'Quiz 2: Data Types and Operators',
                completed: false,
                questions: [
                  {
                    id: 'q1',
                    question: 'What is the output of: print(type(5.0))',
                    options: [
                      "<class 'int'>",
                      "<class 'float'>",
                      "<class 'str'>",
                      "<class 'double'>"
                    ],
                    correctAnswer: 1,
                    explanation: '5.0 is a floating-point number, so its type is float.'
                  },
                  {
                    id: 'q2',
                    question: 'Which operator is used for exponentiation in Python?',
                    options: ['^', '**', 'exp', 'pow'],
                    correctAnswer: 1,
                    explanation: 'The ** operator is used for exponentiation. For example, 2**3 = 8.'
                  },
                  {
                    id: 'q3',
                    question: 'What is the output of: print(10 // 3)',
                    options: ['3.33', '3', '3.0', '4'],
                    correctAnswer: 1,
                    explanation: 'The // operator performs floor division, returning only the integer part: 10 // 3 = 3.'
                  },
                  {
                    id: 'q4',
                    question: 'Which of the following is an immutable data type?',
                    options: ['List', 'Dictionary', 'Tuple', 'Set'],
                    correctAnswer: 2,
                    explanation: 'Tuples are immutable, meaning they cannot be modified after creation.'
                  },
                  {
                    id: 'q5',
                    question: 'What is the output of: print(5 == 5 and 3 > 2)',
                    options: ['True', 'False', 'Error', 'None'],
                    correctAnswer: 0,
                    explanation: 'Both conditions are true (5 == 5 is True and 3 > 2 is True), so the result is True.'
                  },
                  {
                    id: 'q6',
                    question: 'How do you access the last element of a list named "items"?',
                    options: ['items[last]', 'items[-1]', 'items[end]', 'items[0]'],
                    correctAnswer: 1,
                    explanation: 'Negative indexing allows access from the end. items[-1] gets the last element.'
                  },
                  {
                    id: 'q7',
                    question: 'What does the "in" operator do?',
                    options: [
                      'Assigns a value',
                      'Checks membership in a sequence',
                      'Performs division',
                      'Compares two values'
                    ],
                    correctAnswer: 1,
                    explanation: 'The "in" operator checks if a value exists in a sequence like a list, tuple, or string.'
                  },
                  {
                    id: 'q8',
                    question: 'What is the output of: print(not False)',
                    options: ['True', 'False', '1', '0'],
                    correctAnswer: 0,
                    explanation: 'The "not" operator inverts the boolean value. not False = True.'
                  },
                  {
                    id: 'q9',
                    question: 'Which data type is used to store key-value pairs?',
                    options: ['List', 'Tuple', 'Dictionary', 'Set'],
                    correctAnswer: 2,
                    explanation: 'Dictionaries store data as key-value pairs, e.g., {1: "one", 2: "two"}.'
                  },
                  {
                    id: 'q10',
                    question: 'What is the result of: 10 if 5 > 3 else 20',
                    options: ['10', '20', 'True', 'False'],
                    correctAnswer: 0,
                    explanation: 'This is a ternary operator. Since 5 > 3 is True, it returns 10.'
                  },
                  {
                    id: 'q11',
                    question: 'What is the output of: print(type([1, 2, 3]))',
                    options: [
                      "<class 'tuple'>",
                      "<class 'list'>",
                      "<class 'array'>",
                      "<class 'set'>"
                    ],
                    correctAnswer: 1,
                    explanation: 'Square brackets [] define a list in Python, so the type is list.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    whatYouWillLearn: [
      'Fundamentals of AI and Machine Learning',
      'Python programming for data science',
      'Data preprocessing and visualization',
      'Building and training ML models',
      'Model evaluation and optimization',
      'Real-world AI applications'
    ],
    requirements: [
      'Basic programming knowledge',
      'High school level mathematics',
      'Python installation (we\'ll guide you)'
    ]
};

const coursesData = {
  1: aiMLCourse,
  2: {
    ...aiMLCourse,
    id: 2,
    title: 'Data Analytics',
    description: 'Learn data analysis and visualization with Python and popular libraries.',
    category: 'Data Science',
    instructor: 'Muntazir Mehdi & Keshav Kashyap',
    image: '/data-analytics-course.jpg'
  },
  3: {
    id: 3,
    title: 'MERN Stack Development',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    category: 'Web Development',
    duration: '14 weeks',
    level: 'Intermediate',
    instructor: 'Tushar Pandey & Mehul Gupta',
    image: '/mern-course.jpg',
    modules: [
      // Add your MERN Stack course modules here
    ],
    whatYouWillLearn: [
      'Full-stack JavaScript development',
      'Building RESTful APIs with Express',
      'Frontend development with React',
      'Database design with MongoDB',
      'User authentication and authorization',
      'Deploying MERN applications'
    ],
    requirements: [
      'Basic HTML, CSS, and JavaScript',
      'Basic understanding of web development',
      'Node.js and npm installed'
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading: authLoading } = useAuth();
  const [activeModule, setActiveModule] = useState(null);
  const [enrolled, setEnrolled] = useState(true); // Default to true for demo
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [moduleProgress, setModuleProgress] = useState({});
  const [viewingArticle, setViewingArticle] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('chapters'); // chapters, live, leaderboard, noticeboard, attendance
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
  const [contentFilter, setContentFilter] = useState('all'); // all, articles, problems, quiz
  
  // Initialize course data and progress
  useEffect(() => {
    const courseData = coursesData[id] || coursesData[1];

    // Calculate progress for each module
    const calculatedModuleProgress = {};
    courseData.modules.forEach(module => {
      const totalItems = module.lessons.length;
      const completedItems = module.lessons.filter(lesson => lesson.completed).length;
      calculatedModuleProgress[module.id] = totalItems > 0 
        ? Math.round((completedItems / totalItems) * 100) 
        : 0;
    });
    
    // Calculate overall course progress
    const allLessons = courseData.modules.flatMap(m => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter(l => l.completed).length;
    const overallProgress = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;
    
    setCourse(courseData);
    setModuleProgress(calculatedModuleProgress);
    setProgress(overallProgress);

    // Handle navigation state from problem page
    if (location.state) {
      const { openModule, openLesson, activeFilter } = location.state;
      
      if (openModule) {
        setActiveModule(openModule);
      }
      
      if (openLesson) {
        const module = courseData.modules.find(m => m.id === openModule);
        const lesson = module?.lessons.find(l => l.id === openLesson);
        if (lesson) {
          setCurrentLesson(lesson);
          if (lesson.type === 'day' && lesson.articles && lesson.articles.length > 0) {
            setViewingArticle(lesson.articles[0].content);
          }
        }
      }
      
      if (activeFilter) {
        setContentFilter(activeFilter);
      }
    }
  }, [id, location.state]);
  
  // Handle lesson completion toggle
  const toggleLessonCompletion = async (moduleId, lessonId) => {
    if (!enrolled) return;
    
    try {
      // Get current completion status
      const module = course.modules.find(m => m.id === moduleId);
      const lesson = module?.lessons.find(l => l.id === lessonId);
      const newCompletedStatus = !lesson?.completed;
      
      // Update backend
      await progressAPI.markLessonComplete(id, lessonId, newCompletedStatus);
      
      // Update local state
      setCourse(prevCourse => {
        const updatedModules = prevCourse.modules.map(module => {
          if (module.id === moduleId) {
            const updatedLessons = module.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                return { ...lesson, completed: newCompletedStatus };
              }
              return lesson;
            });
            
            // Update module progress
            const totalItems = updatedLessons.length;
            const completedItems = updatedLessons.filter(l => l.completed).length;
            const newModuleProgress = totalItems > 0 
              ? Math.round((completedItems / totalItems) * 100)
              : 0;
              
            setModuleProgress(prev => ({
              ...prev,
              [moduleId]: newModuleProgress
            }));
            
            return { ...module, lessons: updatedLessons };
          }
          return module;
        });
        
        // Update overall progress
        const allLessons = updatedModules.flatMap(m => m.lessons);
        const totalLessons = allLessons.length;
        const completedLessons = allLessons.filter(l => l.completed).length;
        const newProgress = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;
        
        setProgress(newProgress);
        
        return { ...prevCourse, modules: updatedModules };
      });
    } catch (error) {
      console.error('Error updating lesson completion:', error);
      alert('Failed to update progress. Please try again.');
    }
  };
  
  // Calculate progress (in a real app, this would come from user's progress)
  useEffect(() => {
    if (course) {
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
      const completedLessons = course.modules.flatMap(m => m.lessons).filter(l => l.completed).length;
      setProgress(Math.round((completedLessons / totalLessons) * 100) || 0);
    }
  }, [course]);

  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  // Handle lesson click
  const handleLessonClick = (moduleId, lessonId, event) => {
    event.stopPropagation();
    
    if (!enrolled) {
      alert('Please enroll in the course to access the lessons');
      return;
    }
    
    // Find the lesson
    const module = course.modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);
    
    if (!lesson) return;
    
    // If it's an article with content, show it
    if (lesson.type === 'article' && lesson.content) {
      setViewingArticle(lesson.content);
      setCurrentLesson(lesson);
      return;
    }
    
    // If it's a day with articles/problems/quiz, show the first article
    if (lesson.type === 'day' && lesson.articles && lesson.articles.length > 0) {
      setViewingArticle(lesson.articles[0].content);
      setCurrentLesson(lesson);
      return;
    }
    
    // For other lessons, toggle completion
    toggleLessonCompletion(moduleId, lessonId);
    const action = lesson.completed ? 'marked as incomplete' : 'marked as complete';
    alert(`Lesson "${lesson.title}" ${action}`);
  };
  
  // Render progress bar
  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  // Render article view with foldable sidebar
  const renderArticleView = () => {
    const currentModule = course.modules.find(m => m.lessons.some(l => l.id === currentLesson?.id));
    
    // Calculate module progress dynamically
    const moduleCompletedLessons = currentModule?.lessons.filter(l => l.completed).length || 0;
    const moduleTotalLessons = currentModule?.lessons.length || 1;
    const moduleProgressPercent = Math.round((moduleCompletedLessons / moduleTotalLessons) * 100);
    
    // Count different types of content
    const articlesCount = currentModule?.lessons.filter(l => l.type === 'article').length || 0;
    const daysCount = currentModule?.lessons.filter(l => l.type === 'day').length || 0;
    const totalContent = currentModule?.lessons.length || 0;
    
    return (
      <div className="fixed inset-0 flex gap-0 bg-white" style={{ top: '106px' }}>
        {/* Left Sidebar - Lesson Navigation (Foldable) - Extreme Left */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-16'} flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 h-screen z-40`} style={{ top: '106px' }}>
          <div className="h-screen overflow-y-auto">
            {sidebarOpen ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setViewingArticle(null)}
                    className="flex items-center text-sm text-gray-600 hover:text-[#2f8d46]"
                  >
                    <FaArrowLeft className="mr-2" /> {currentModule?.title || 'Back'}
                  </button>
                </div>
                
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-[#2f8d46]">{moduleProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#2f8d46] h-1.5 rounded-full transition-all duration-300" style={{ width: `${moduleProgressPercent}%` }}></div>
                  </div>
                </div>
                
                {/* Tabs for filtering content (only for day type lessons) */}
                {currentLesson?.type === 'day' && (
                  <div className="border-b border-gray-200 mb-3">
                    <div className="flex">
                      <button
                        onClick={() => setContentFilter('articles')}
                        className={`flex-1 py-2 text-xs font-medium ${
                          contentFilter === 'articles'
                            ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaBook className="inline mr-1" />
                        Articles
                      </button>
                      <button
                        onClick={() => setContentFilter('problems')}
                        className={`flex-1 py-2 text-xs font-medium ${
                          contentFilter === 'problems'
                            ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaClipboardList className="inline mr-1" />
                        Problems
                      </button>
                      <button
                        onClick={() => setContentFilter('quiz')}
                        className={`flex-1 py-2 text-xs font-medium ${
                          contentFilter === 'quiz'
                            ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaQuestionCircle className="inline mr-1" />
                        Quiz
                      </button>
                      <button
                        onClick={() => setContentFilter('all')}
                        className={`flex-1 py-2 text-xs font-medium ${
                          contentFilter === 'all'
                            ? 'text-[#2f8d46] border-b-2 border-[#2f8d46]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaTasks className="inline mr-1" />
                        All
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Lesson List */}
                <div className="p-3">
                  {/* Show different sections based on lesson type */}
                  {currentLesson?.type === 'day' ? (
                    <>
                      {/* Articles Section */}
                      {(contentFilter === 'articles' || contentFilter === 'all') && currentLesson.articles && currentLesson.articles.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-2 text-xs font-semibold text-gray-500 flex items-center">
                            <FaBook className="mr-2" />
                            Articles ({currentLesson.articles.length})
                          </div>
                          {currentLesson.articles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => setViewingArticle(article.content)}
                              className="w-full text-left px-3 py-2.5 rounded text-sm mb-1 flex items-center transition-colors text-gray-700 hover:bg-gray-50"
                            >
                              {article.completed ? (
                                <FaCheckCircle className="mr-3 text-[#2f8d46] flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 mr-3 border-2 border-gray-300 rounded-full flex-shrink-0" />
                              )}
                              <span className="line-clamp-2">{article.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Problems Section */}
                      {(contentFilter === 'problems' || contentFilter === 'all') && currentLesson.problems && currentLesson.problems.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-2 text-xs font-semibold text-gray-500 flex items-center">
                            <FaClipboardList className="mr-2" />
                            Problems ({currentLesson.problems.length})
                          </div>
                          {currentLesson.problems.map((problem) => (
                            <Link
                              key={problem.id}
                              to={`/problems/${problem.id}`}
                              state={{ 
                                fromCourse: id, 
                                fromModule: currentModule?.id,
                                fromLesson: currentLesson?.id,
                                activeTab: 'problems'
                              }}
                              className="w-full text-left px-3 py-2.5 rounded text-sm mb-1 flex items-center transition-colors text-gray-700 hover:bg-gray-50"
                            >
                              {problem.completed ? (
                                <FaCheckCircle className="mr-3 text-[#2f8d46] flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 mr-3 border-2 border-gray-300 rounded-full flex-shrink-0" />
                              )}
                              <span className="line-clamp-2">{problem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      {/* Quiz Section */}
                      {(contentFilter === 'quiz' || contentFilter === 'all') && currentLesson.quiz && currentLesson.quiz.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-2 text-xs font-semibold text-gray-500 flex items-center">
                            <FaQuestionCircle className="mr-2" />
                            Quiz
                          </div>
                          {currentLesson.quiz.map((quiz) => (
                            <Link
                              key={quiz.id}
                              to={`/quiz/${quiz.id}`}
                              state={{ 
                                fromCourse: id, 
                                fromModule: currentModule?.id,
                                fromLesson: currentLesson?.id,
                                activeTab: 'quiz'
                              }}
                              className="w-full text-left px-3 py-2.5 rounded text-sm mb-1 flex items-center transition-colors text-gray-700 hover:bg-gray-50"
                            >
                              {quiz.completed ? (
                                <FaCheckCircle className="mr-3 text-[#2f8d46] flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 mr-3 border-2 border-gray-300 rounded-full flex-shrink-0" />
                              )}
                              <span className="line-clamp-2">{quiz.title} ({quiz.questions?.length || quiz.questions} MCQs)</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* For article type lessons, show module lessons */}
                      <div className="mb-3">
                        <div className="px-2 py-2 text-xs font-semibold text-gray-500 flex items-center">
                          <FaBook className="mr-2" />
                          Articles ({articlesCount})
                        </div>
                      </div>
                      
                      {currentModule?.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentLesson(lesson);
                            if (lesson.content) {
                              setViewingArticle(lesson.content);
                            }
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded text-sm mb-1 flex items-center transition-colors ${
                            currentLesson?.id === lesson.id
                              ? 'bg-green-50 text-[#2f8d46] font-medium border-l-4 border-[#2f8d46]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {lesson.completed ? (
                            <FaCheckCircle className="mr-3 text-[#2f8d46] flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 mr-3 border-2 border-gray-300 rounded-full flex-shrink-0" />
                          )}
                          <span className="line-clamp-2">{lesson.title}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Minimized Sidebar - Icon Navigation */
              <div className="flex flex-col h-full bg-gray-50">
                {/* Back Button */}
                <div className="p-3 border-b border-gray-200 bg-white">
                  <button
                    onClick={() => setViewingArticle(null)}
                    className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-[#2f8d46] hover:bg-gray-100 rounded transition-colors"
                    title="Back"
                  >
                    <FaArrowLeft className="text-xl" />
                  </button>
                </div>
                
                {/* Navigation Icons */}
                <div className="flex-1 py-4">
                  {/* Articles Icon */}
                  <button
                    className="w-full flex flex-col items-center py-3 px-2 text-[#2f8d46] bg-green-50 border-l-4 border-[#2f8d46] hover:bg-green-100 transition-colors"
                    title="Articles"
                  >
                    <FaBook className="text-xl mb-1" />
                    <span className="text-[10px] font-medium">Articles</span>
                  </button>
                  
                  {/* Show Problems and Quiz only if not Course Overview */}
                  {currentLesson?.type !== 'article' && (
                    <>
                      {/* Problems Icon */}
                      <button
                        className="w-full flex flex-col items-center py-3 px-2 text-gray-500 hover:text-[#2f8d46] hover:bg-green-50 transition-colors"
                        title="Problems"
                      >
                        <FaClipboardList className="text-xl mb-1" />
                        <span className="text-[10px]">Problems</span>
                      </button>
                      
                      {/* Quiz Icon */}
                      <button
                        className="w-full flex flex-col items-center py-3 px-2 text-gray-500 hover:text-[#2f8d46] hover:bg-green-50 transition-colors"
                        title="Quiz"
                      >
                        <FaQuestionCircle className="text-xl mb-1" />
                        <span className="text-[10px]">Quiz</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* All Icon - Bottom */}
                <div className="border-t border-gray-200 bg-white">
                  <button
                    className="w-full flex flex-col items-center py-3 px-2 text-gray-500 hover:text-[#2f8d46] hover:bg-green-50 transition-colors"
                    title="All"
                  >
                    <FaTasks className="text-xl mb-1" />
                    <span className="text-[10px]">All</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Fixed on extreme left edge */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed z-50 bg-[#2f8d46] text-white p-2 rounded-r-lg shadow-lg hover:bg-[#267a3a] transition-all duration-300 ${
            sidebarOpen ? 'left-72' : 'left-16'
          }`}
          style={{ width: '32px', height: '48px', top: 'calc(50% + 53px)', transform: 'translateY(-50%)' }}
        >
          {sidebarOpen ? (
            <FaArrowLeft className="text-sm" />
          ) : (
            <FaArrowRight className="text-sm" />
          )}
        </button>

        {/* Main Content Area - Maximizes when sidebar is minimized */}
        <div className={`flex-1 bg-white overflow-y-auto h-screen ${sidebarOpen ? 'ml-72' : 'ml-16'} transition-all duration-300`}>
          <div className={`${sidebarOpen ? 'max-w-5xl' : 'max-w-7xl'} mx-auto px-8 py-8 transition-all duration-300`}>
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentModule?.title || 'Course Plan'}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  💬
                </button>
                <button 
                  onClick={() => {
                    if (currentLesson?.articles) {
                      const currentIndex = currentLesson.articles.findIndex(
                        a => a.content === viewingArticle
                      );
                      if (currentIndex > 0) {
                        setViewingArticle(currentLesson.articles[currentIndex - 1].content);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }}
                  disabled={
                    !currentLesson?.articles ||
                    currentLesson.articles.findIndex(a => a.content === viewingArticle) === 0
                  }
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaArrowLeft className="mr-2" /> Prev
                </button>
                <button 
                  onClick={() => {
                    if (currentLesson?.articles) {
                      const currentIndex = currentLesson.articles.findIndex(
                        a => a.content === viewingArticle
                      );
                      if (currentIndex < currentLesson.articles.length - 1) {
                        setViewingArticle(currentLesson.articles[currentIndex + 1].content);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }}
                  disabled={
                    !currentLesson?.articles ||
                    currentLesson.articles.findIndex(a => a.content === viewingArticle) ===
                      currentLesson.articles.length - 1
                  }
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            
            {/* Content with Better Typography */}
            <div className="prose prose-lg max-w-none">
              <style>{`
                .prose h2 {
                  font-size: 1.75rem;
                  font-weight: 700;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  color: #1f2937;
                }
                .prose h3 {
                  font-size: 1.375rem;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  color: #374151;
                }
                .prose p {
                  font-size: 1.125rem;
                  line-height: 1.75;
                  margin-bottom: 1.25rem;
                  color: #4b5563;
                }
                .prose ul {
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                }
                .prose li {
                  font-size: 1.0625rem;
                  line-height: 1.75;
                  margin-bottom: 0.5rem;
                  color: #4b5563;
                }
                .prose strong {
                  color: #1f2937;
                  font-weight: 600;
                }
                .prose code:not(pre code) {
                  background-color: #f3f4f6;
                  padding: 0.125rem 0.375rem;
                  border-radius: 0.25rem;
                  font-size: 0.9em;
                  color: #2f8d46;
                }
                .prose pre {
                  padding: 0;
                  margin: 0;
                  background: transparent;
                }
              `}</style>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    
                    return !inline ? (
                      <CodeBlock language={language}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-gray-900 mb-5 mt-7" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-xl font-bold text-gray-900 mb-3 mt-5" {...props} />,
                  h5: ({ node, ...props }) => <h5 className="text-lg font-bold text-gray-900 mb-2 mt-4" {...props} />,
                  h6: ({ node, ...props }) => <h6 className="text-base font-bold text-gray-900 mb-2 mt-3" {...props} />
                }}
              >
                {viewingArticle || 'No content available.'}
              </ReactMarkdown>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {/* Previous Article Button */}
                <button
                  onClick={() => {
                    if (currentLesson?.articles) {
                      const currentIndex = currentLesson.articles.findIndex(
                        a => a.content === viewingArticle
                      );
                      if (currentIndex > 0) {
                        setViewingArticle(currentLesson.articles[currentIndex - 1].content);
                      }
                    }
                  }}
                  disabled={
                    !currentLesson?.articles ||
                    currentLesson.articles.findIndex(a => a.content === viewingArticle) === 0
                  }
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous Article
                </button>

                {/* Mark as Read Button */}
                <button
                  onClick={() => {
                    const moduleId = currentModule?.id;
                    if (moduleId && currentLesson) {
                      toggleLessonCompletion(moduleId, currentLesson.id);
                    }
                  }}
                  className="px-8 py-3 bg-[#2f8d46] text-white rounded-lg font-semibold hover:bg-[#267a3a] transition-colors shadow-sm"
                >
                  Mark as Read
                </button>

                {/* Next Article Button */}
                <button
                  onClick={() => {
                    if (currentLesson?.articles) {
                      const currentIndex = currentLesson.articles.findIndex(
                        a => a.content === viewingArticle
                      );
                      if (currentIndex < currentLesson.articles.length - 1) {
                        setViewingArticle(currentLesson.articles[currentIndex + 1].content);
                      }
                    }
                  }}
                  disabled={
                    !currentLesson?.articles ||
                    currentLesson.articles.findIndex(a => a.content === viewingArticle) ===
                      currentLesson.articles.length - 1
                  }
                  className="px-6 py-3 bg-[#2f8d46] text-white rounded-lg font-semibold hover:bg-[#267a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Next Article →
                </button>
              </div>
            </div>

            {/* Report Issue Section */}
            <div className="mt-8 text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <button className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors shadow-sm">
                ⚠️ Report an Issue
              </button>
              <p className="text-sm text-gray-600 mt-3">If you are facing any issue on this page, please let us know.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Course Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/" 
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Link 
                to="/courses" 
                className="inline-flex items-center text-sm font-medium text-[#2f8d46] hover:text-[#267a3a] mb-4"
              >
                <FaArrowLeft className="mr-2" /> Back to Courses
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">
                    {course.modules.flatMap(m => m.lessons).filter(l => l.completed).length} of {course.modules.flatMap(m => m.lessons).length} Complete, ({progress}%)
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#2f8d46] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Progress may take upto 2 hours to reflect.</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-6">
              <button
                className="px-6 py-2 border-2 border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Share Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chapters'
                  ? 'border-[#2f8d46] text-[#2f8d46]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              CHAPTERS
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'live'
                  ? 'border-[#2f8d46] text-[#2f8d46]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              LIVE
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaderboard'
                  ? 'border-[#2f8d46] text-[#2f8d46]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              LEADERBOARD
            </button>
            <button
              onClick={() => setActiveTab('noticeboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'noticeboard'
                  ? 'border-[#2f8d46] text-[#2f8d46]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              NOTICEBOARD
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-[#2f8d46] text-[#2f8d46]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCalendarCheck className="inline mr-1" />
              ATTENDANCE
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article View - Full Width without Right Sidebar */}
        {viewingArticle ? (
          renderArticleView()
        ) : (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'chapters' && (
            <>
            {/* Continue Where You Left */}
            {(() => {
              // Find the first incomplete lesson or the last lesson
              const allLessons = course.modules.flatMap((module, moduleIndex) => 
                module.lessons.map((lesson, lessonIndex) => ({
                  ...lesson,
                  moduleId: module.id,
                  moduleTitle: module.title,
                  displayNumber: lessonIndex + 1
                }))
              );
              const currentLessonToShow = allLessons.find(l => !l.completed) || allLessons[allLessons.length - 1];
              
              return currentLessonToShow && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">CONTINUE WHERE YOU LEFT</h3>
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={(e) => handleLessonClick(currentLessonToShow.moduleId, currentLessonToShow.id, e)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#2f8d46] rounded flex items-center justify-center text-white font-bold">
                        {currentLessonToShow.displayNumber}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-base font-semibold text-gray-900">{currentLessonToShow.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{currentLessonToShow.moduleTitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Course Content */}
            {!viewingArticle && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="px-4 py-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">
                    Course Modules
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {course.modules.map((module) => (
                      <li key={module.id} className="bg-white">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 focus:outline-none"
                        >
                          <div className="flex items-center flex-1">
                            <div className="ml-2">
                              <h4 className="text-sm font-semibold text-gray-900">{module.title}</h4>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <svg
                              className={`h-4 w-4 text-gray-400 transform transition-transform ${activeModule === module.id ? 'rotate-180' : ''}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </button>
                      {activeModule === module.id && (
                        <ul className="bg-gray-50 divide-y divide-gray-200">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id} className="relative">
                              <button
                                className="w-full px-4 py-3 flex items-center hover:bg-gray-100 focus:outline-none group"
                                onClick={(e) => handleLessonClick(module.id, lesson.id, e)}
                              >
                                <div className="flex items-center w-full">
                                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-[#2f8d46] text-white text-xs font-semibold">
                                    {lesson.completed ? (
                                      <FaCheckCircle className="h-4 w-4" />
                                    ) : (
                                      <span>{lesson.id.split('-')[1]}</span>
                                    )}
                                  </div>
                                  <div className="ml-3 flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#2f8d46]">
                                      {lesson.title}
                                    </p>
                                    <div className="flex items-center mt-1 space-x-3">
                                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Start/Resume Button - Shows on Hover */}
                                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#2f8d46] text-white">
                                      {lesson.completed ? (
                                        <>
                                          <FaPlay className="mr-1 text-[10px]" />
                                          Resume
                                        </>
                                      ) : (
                                        <>
                                          <FaPlay className="mr-1 text-[10px]" />
                                          Start
                                        </>
                                      )}
                                    </span>
                                  </div>
                                  
                                  {lesson.completed && (
                                    <div className="ml-2 flex items-center justify-center w-12 h-12 rounded-full bg-green-100 group-hover:hidden">
                                      <span className="text-sm font-semibold text-green-600">100%</span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            )}
            </>
            )}

            {activeTab === 'live' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No live sessions scheduled at the moment.</p>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Leaderboard coming soon!</p>
              </div>
            )}

            {activeTab === 'noticeboard' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No new notices.</p>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                {userProfile?.role === 'instructor' || userProfile?.role === 'admin' ? (
                  <AttendanceManagement courseId={id} />
                ) : (
                  <AttendanceTab courseId={id} />
                )}
              </div>
            )}

            {/* What You'll Learn */}
            {activeTab === 'chapters' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  What you'll learn
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Live Classes Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">Live classes attendance may take 2 hours to reflect. Attendance won't be considered in case the Classes get Cancelled.</p>
                <div className="mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left text-gray-700">Live Classes</th>
                        <th className="py-2 text-center text-gray-700">Attended</th>
                        <th className="py-2 text-center text-gray-700">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-600">{course.modules.length * 2}</td>
                        <td className="py-2 text-center text-gray-600">{Math.floor(progress / 10)}</td>
                        <td className="py-2 text-center text-gray-600">{Math.min(Math.floor(progress / 10) * 5, 100)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-700 mb-2">Use the scheduler to set your study hours and get notified on the App.</p>
                  <button className="w-full bg-[#2f8d46] text-white py-2 rounded text-sm font-medium hover:bg-[#267a3a]">
                    Add a schedule
                  </button>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded">
                  <button className="w-full bg-yellow-400 text-gray-900 py-2 rounded text-sm font-semibold hover:bg-yellow-500">
                    Report an Issue
                  </button>
                  <p className="text-xs text-gray-600 mt-2">If you are facing any issue on this page. Please let us know.</p>
                </div>
              </div>
            </div>
            {/* Course Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Course Details
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                    <p className="mt-1 text-sm text-gray-900">{course.instructor}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                    <p className="mt-1 text-sm text-gray-900">{course.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Level</h4>
                    <p className="mt-1 text-sm text-gray-900">{course.level}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="mt-1 text-sm text-gray-900">{course.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Requirements
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Certificate */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Certificate
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FaCertificate className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="mt-3 text-sm font-medium text-gray-900">Certificate of Completion</h4>
                <p className="mt-1 text-sm text-gray-500">Earn a certificate upon completing this course</p>
                <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  View Sample Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
