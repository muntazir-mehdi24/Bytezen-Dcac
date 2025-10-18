// Day 5: Dictionaries, Tuples and Sets
// Insert this after Day 4 (line 3704) in CourseDetail.jsx

,
{ 
  id: '1-5', 
  title: 'Day 5: Dictionaries, Tuples and Sets in Python', 
  duration: '3 Articles • 5 Problems • 10 MCQs',
  type: 'day',
  completed: false,
  articles: [
    {
      id: '1-5-a1',
      title: 'Python Dictionary',
      completed: false,
      content: `# Python Dictionary

Dictionaries store data in key:value pairs. They are ordered (Python 3.7+), changeable, and don't allow duplicate keys.

## Creating Dictionaries

\`\`\`python
student = {
    "name": "Alice",
    "age": 20,
    "course": "Computer Science"
}
print(student)
\`\`\`

## Accessing Items

\`\`\`python
print(student["name"])        # Alice
print(student.get("age"))     # 20
\`\`\`

## Dictionary Methods

\`\`\`python
# keys(), values(), items()
print(student.keys())
print(student.values())
print(student.items())

# Adding/updating
student["grade"] = "A"
student.update({"age": 21})

# Removing
student.pop("grade")
\`\`\`

## Looping

\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## Dictionary Comprehension

\`\`\`python
squares = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
\`\`\``
    },
    {
      id: '1-5-a2',
      title: 'Python Tuple',
      completed: false,
      content: `# Python Tuple

Tuples are ordered and immutable collections.

## Creating Tuples

\`\`\`python
fruits = ("apple", "banana", "cherry")
single = ("apple",)  # Note the comma
\`\`\`

## Accessing Items

\`\`\`python
print(fruits[0])    # apple
print(fruits[-1])   # cherry
print(fruits[1:3])  # ('banana', 'cherry')
\`\`\`

## Tuple Methods

\`\`\`python
numbers = (1, 2, 3, 2, 4, 2)
print(numbers.count(2))  # 3
print(numbers.index(3))  # 2
\`\`\`

## Unpacking

\`\`\`python
fruits = ("apple", "banana", "cherry")
a, b, c = fruits

# With asterisk
numbers = (1, 2, 3, 4, 5)
first, *middle, last = numbers
# first=1, middle=[2,3,4], last=5
\`\`\`

## Why Use Tuples?

- Immutable (data protection)
- Faster than lists
- Can be dictionary keys
- Return multiple values from functions`
    },
    {
      id: '1-5-a3',
      title: 'Python Sets',
      completed: false,
      content: `# Python Sets

Sets are unordered collections with no duplicates.

## Creating Sets

\`\`\`python
fruits = {"apple", "banana", "cherry"}
numbers = {1, 2, 3, 2, 4}  # {1, 2, 3, 4}
\`\`\`

## Adding/Removing

\`\`\`python
fruits.add("orange")
fruits.update(["mango", "grape"])
fruits.remove("banana")
fruits.discard("kiwi")  # No error if not found
\`\`\`

## Set Operations

\`\`\`python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Union
print(set1 | set2)  # {1, 2, 3, 4, 5, 6}

# Intersection
print(set1 & set2)  # {3, 4}

# Difference
print(set1 - set2)  # {1, 2}

# Symmetric Difference
print(set1 ^ set2)  # {1, 2, 5, 6}
\`\`\`

## Use Cases

\`\`\`python
# Remove duplicates
my_list = [1, 2, 2, 3, 4, 4]
unique = list(set(my_list))

# Fast membership testing
if item in my_set:  # Very fast
    print("Found")
\`\`\``
    }
  ],
  problems: [
    {
      id: '1-5-p1',
      title: 'Dictionary Operations',
      difficulty: 'Easy',
      points: 3,
      description: 'Create and manipulate a student dictionary with name, age, grade, and subjects.',
      starterCode: `student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "subjects": ["Math", "Physics"]
}

# Add Chemistry to subjects
# Update grade to A+

print(student)`,
      solution: `student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "subjects": ["Math", "Physics"]
}

student["subjects"].append("Chemistry")
student["grade"] = "A+"

print(student)`,
      testCases: [
        { input: '', expectedOutput: "{'name': 'Alice', 'age': 20, 'grade': 'A+', 'subjects': ['Math', 'Physics', 'Chemistry']}" }
      ]
    },
    {
      id: '1-5-p2',
      title: 'Word Frequency Counter',
      difficulty: 'Medium',
      points: 4,
      description: 'Count frequency of each word in a sentence using a dictionary.',
      starterCode: `def count_words(sentence):
    words = sentence.lower().split()
    word_count = {}
    
    # Your code here
    
    return word_count

print(count_words("hello world hello python"))`,
      solution: `def count_words(sentence):
    words = sentence.lower().split()
    word_count = {}
    
    for word in words:
        word_count[word] = word_count.get(word, 0) + 1
    
    return word_count

print(count_words("hello world hello python"))`,
      testCases: [
        { input: 'hello world hello python', expectedOutput: "{'hello': 2, 'world': 1, 'python': 1}" }
      ]
    },
    {
      id: '1-5-p3',
      title: 'Tuple Unpacking',
      difficulty: 'Easy',
      points: 2,
      description: 'Practice unpacking tuples with different patterns.',
      starterCode: `coordinates = (10, 20, 30)
# Unpack into x, y, z

data = (1, 2, 3, 4, 5)
# Unpack first, middle, last

print(f"x={x}, y={y}, z={z}")
print(f"first={first}, last={last}")`,
      solution: `coordinates = (10, 20, 30)
x, y, z = coordinates

data = (1, 2, 3, 4, 5)
first, *middle, last = data

print(f"x={x}, y={y}, z={z}")
print(f"first={first}, last={last}")`,
      testCases: [
        { input: '', expectedOutput: 'x=10, y=20, z=30' }
      ]
    },
    {
      id: '1-5-p4',
      title: 'Set Operations',
      difficulty: 'Medium',
      points: 4,
      description: 'Find common, unique, and different elements between two sets.',
      starterCode: `set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

# Find common elements
common = 

# Find elements only in set1
only_set1 = 

# Find all unique elements
all_unique = 

print(f"Common: {common}")`,
      solution: `set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

common = set1 & set2
only_set1 = set1 - set2
all_unique = set1 | set2

print(f"Common: {common}")
print(f"Only in set1: {only_set1}")
print(f"All unique: {all_unique}")`,
      testCases: [
        { input: '', expectedOutput: 'Common: {4, 5}' }
      ]
    },
    {
      id: '1-5-p5',
      title: 'Remove Duplicates',
      difficulty: 'Easy',
      points: 3,
      description: 'Remove duplicates from a list using sets and return sorted result.',
      starterCode: `def remove_duplicates(numbers):
    # Convert to set and back to sorted list
    
    return result

print(remove_duplicates([5, 2, 8, 2, 9, 5, 1]))`,
      solution: `def remove_duplicates(numbers):
    return sorted(list(set(numbers)))

print(remove_duplicates([5, 2, 8, 2, 9, 5, 1]))`,
      testCases: [
        { input: '[5, 2, 8, 2, 9, 5, 1]', expectedOutput: '[1, 2, 5, 8, 9]' }
      ]
    }
  ],
  quiz: [
    {
      id: '1-5-quiz',
      title: 'Day 5: Dictionaries, Tuples and Sets Quiz',
      questions: [
        {
          id: 'q1',
          question: 'How do you create a dictionary in Python?',
          options: ['dict = []', 'dict = ()', 'dict = {}', 'dict = ""'],
          correctAnswer: 2,
          explanation: 'Dictionaries use curly braces {} with key-value pairs.'
        },
        {
          id: 'q2',
          question: 'What is len({1, 2, 2, 3, 4, 4, 5})?',
          options: ['7', '5', '6', 'Error'],
          correctAnswer: 1,
          explanation: 'Sets remove duplicates automatically, leaving 5 unique elements.'
        },
        {
          id: 'q3',
          question: 'Are tuples mutable?',
          options: ['Yes', 'No', 'Sometimes', 'Only with lists inside'],
          correctAnswer: 1,
          explanation: 'Tuples are immutable - cannot be changed after creation.'
        },
        {
          id: 'q4',
          question: 'Which method adds an item to a set?',
          options: ['append()', 'add()', 'insert()', 'push()'],
          correctAnswer: 1,
          explanation: 'Sets use add() method to add single items.'
        },
        {
          id: 'q5',
          question: 'What does dict.get("key") return if key doesn\'t exist?',
          options: ['Error', 'None', '0', 'False'],
          correctAnswer: 1,
          explanation: 'get() returns None by default if key is not found.'
        },
        {
          id: 'q6',
          question: 'What is {1,2,3} & {2,3,4}?',
          options: ['{1,2,3,4}', '{2,3}', '{1,4}', 'Error'],
          correctAnswer: 1,
          explanation: '& is intersection operator, returns common elements {2,3}.'
        },
        {
          id: 'q7',
          question: 'Can tuples be used as dictionary keys?',
          options: ['Yes', 'No', 'Only if empty', 'Only with numbers'],
          correctAnswer: 0,
          explanation: 'Tuples are immutable and hashable, so they can be dictionary keys.'
        },
        {
          id: 'q8',
          question: 'What does dict.keys() return?',
          options: ['List of keys', 'Tuple of keys', 'dict_keys object', 'Set of keys'],
          correctAnswer: 2,
          explanation: 'dict.keys() returns a dict_keys view object.'
        },
        {
          id: 'q9',
          question: 'What is {1,2,3} | {3,4,5}?',
          options: ['{3}', '{1,2,3,4,5}', '{1,2,4,5}', 'Error'],
          correctAnswer: 1,
          explanation: '| is union operator, combines all unique elements.'
        },
        {
          id: 'q10',
          question: 'How to create a single-item tuple?',
          options: ['(1)', '(1,)', '[1]', '{1}'],
          correctAnswer: 1,
          explanation: 'Single-item tuple needs trailing comma: (1,)'
        }
      ]
    }
  ]
}
