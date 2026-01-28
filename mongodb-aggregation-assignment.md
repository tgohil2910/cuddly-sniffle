# MongoDB Aggregation Pipelines Comprehensive Assignment

## Overview
This assignment provides hands-on practice with MongoDB aggregation pipelines through four different real-world scenarios. You'll work with various datasets to perform filtering, grouping, sorting, data transformation, and complex multi-stage analyses.

Each scenario includes:
- Database and collection setup with sample data
- Step-by-step tasks of increasing complexity
- Specific output format requirements where applicable

## Submission Requirements
- Submit **4 JavaScript files** (.js extension) in your repository:
  - `scenario1.js` - Solutions for Cities Data Analysis
  - `scenario2.js` - Solutions for E-commerce Analytics
  - `scenario3.js` - Solutions for Product Catalog Analytics
  - `scenario4.js` - Solutions for University Student Data
- Each file should export an object with pipeline arrays for each task (see examples below)
- Example file structure:
  ```javascript
  // scenario1.js
    part1: [ /* your pipeline for Part 1 */ ],
    part2_task1: [ /* pipeline for Part 2 Task 1 */ ],
    part2_task2: [ /* pipeline for Part 2 Task 2 */ ],
    part3: [ /* pipeline for Part 3 */ ],
    part4: [ /* pipeline for Part 4 */ ]
  };
  ```
- Your pipelines will be automatically tested against expected results
- Ensure your code is syntactically correct and follows MongoDB aggregation syntax

## Scenario 1: Aggregation Pipelines & Data Analysis

**Database:** `geoDB`  
**Collection:** `cities`

### Setup Data
```javascript
db.cities.insertMany([
    {"name": "Seoul", "country": "South Korea", "continent": "Asia", "population": 25.674 },
    {"name": "Mumbai", "country": "India", "continent": "Asia", "population": 19.980 },
    {"name": "Lagos", "country": "Nigeria", "continent": "Africa", "population": 13.463 },
    {"name": "Beijing", "country": "China", "continent": "Asia", "population": 19.618 },
    {"name": "Shanghai", "country": "China", "continent": "Asia", "population": 25.582 },
    {"name": "Osaka", "country": "Japan", "continent": "Asia", "population": 19.281 },
    {"name": "Cairo", "country": "Egypt", "continent": "Africa", "population": 20.076 },
    {"name": "Tokyo", "country": "Japan", "continent": "Asia", "population": 37.400 },
    {"name": "Karachi", "country": "Pakistan", "continent": "Asia", "population": 15.400 },
    {"name": "Dhaka", "country": "Bangladesh", "continent": "Asia", "population": 19.578 },
    {"name": "Rio de Janeiro", "country": "Brazil", "continent": "South America", "population": 13.293 },
    {"name": "São Paulo", "country": "Brazil", "continent": "South America", "population": 21.650 },
    {"name": "Mexico City", "country": "Mexico", "continent": "North America", "population": 21.581 },
    {"name": "Delhi", "country": "India", "continent": "Asia", "population": 28.514 },
    {"name": "Buenos Aires", "country": "Argentina", "continent": "South America", "population": 14.967 },
    {"name": "Kolkata", "country": "India", "continent": "Asia", "population": 14.681 },
    {"name": "New York", "country": "United States", "continent": "North America", "population": 18.819 },
    {"name": "Manila", "country": "Philippines", "continent": "Asia", "population": 13.482 },
    {"name": "Chongqing", "country": "China", "continent": "Asia", "population": 14.838 },
    {"name": "Istanbul", "country": "Turkey", "continent": "Europe", "population": 14.751 }
]);
```

### Tasks

#### Part 1: Basic Filtering & Sorting
Create a pipeline to find all cities situated in **"South America"**. Arrange the resulting list alphabetically by the city `name` (A to Z).

#### Part 2: Grouping & Analysis
1. **Average Population by Continent**  
   Analyze the data to find the **average population** for each continent in the dataset.

2. **Counting Cities per Country**  
   Identify which countries have multiple major cities in our list. Return only the countries that have **2 or more** cities in this dataset, along with their city count.

#### Part 3: Data Transformation
**Reshaping Output**  
Return a list of all cities in **"Asia"**, but reshape the output documents to match a specific format. The output documents must strictly contain **only** two fields:
- `city`: The name of the city.
- `pop`: The population of the city.  
(Ensure no other fields, such as `_id` or `country`, appear in the output).

#### Part 4: Complex Multi-Stage Pipeline
**The "Mega-City" Analysis**  
Perform a multi-step analysis to find specific "Mega-Cities" (population > 15 million).  
**Requirements:**
1. Filter the data to include only cities with a population **greater than 15 million**.
2. For each continent, calculate the **total population** of these mega-cities.
3. Sort the final results by this total population in **descending order**.
4. Format the final output documents to look exactly like this example:  
   `{ "region": "Asia", "total_mega_pop": 125.5 }`

## Scenario 2: E-commerce Analytics

**Database:** `shopDB`  
**Collection:** `orders`

### Setup Data
```javascript
db.orders.insertMany([
  { "orderId": 101, "customer": "Alice", "status": "completed", "total": 1200, "items": 3 },
  { "orderId": 102, "customer": "Bob", "status": "pending", "total": 450, "items": 1 },
  { "orderId": 103, "customer": "Alice", "status": "completed", "total": 700, "items": 2 },
  { "orderId": 104, "customer": "Charlie", "status": "cancelled", "total": 200, "items": 1 },
  { "orderId": 105, "customer": "Bob", "status": "completed", "total": 300, "items": 1 },
  { "orderId": 106, "customer": "David", "status": "completed", "total": 1500, "items": 4 },
  { "orderId": 107, "customer": "Alice", "status": "pending", "total": 100, "items": 1 },
  { "orderId": 108, "customer": "Eve", "status": "completed", "total": 2500, "items": 5 },
  { "orderId": 109, "customer": "Charlie", "status": "completed", "total": 450, "items": 2 },
  { "orderId": 110, "customer": "Eve", "status": "cancelled", "total": 0, "items": 0 }
]);
```

### Tasks

#### Part 1: Simple Filter & Project
**Completed Orders Report**  
Find orders with status **"completed"**. Return only the `customer` name and the `total` amount.

#### Part 2: Grouping & Aggregation
**Average Transaction Value**  
Calculate the **average order value** for all "completed" orders.  
*(Hint: Match first, then Group by null)*

#### Part 3: Multi-Stage Analysis
**Customer Lifetime Value (CLV)**  
1. **Match:** Filter for "completed" orders only.  
2. **Group:** Group by `customer` and sum their total spend.  
3. **Sort:** Order customers by total spend (Highest first).

#### Part 4: The VIP Pipeline (Advanced)
**High-Value Customer Report**  
Identify "VIP Customers" who have spent more than 1000 in total.  

**Pipeline Stages Required:**
1. **Match:** Filter only "completed" orders.
2. **Group:** Group by customer and calculate `totalSpent`.
3. **Match:** Filter the *grouped* results to keep only customers with `totalSpent > 1000`.
4. **Sort:** Sort by `totalSpent` descending.
5. **Project:** Format the output to: `{ "VIP_Name": "Alice", "Grand_Total": 1900 }`.

## Scenario 3: Product Catalog Analytics

**Database:** `techDB`  
**Collection:** `phones`

### Setup Data
```javascript
db.phones.insertMany([
  { "model": "Pixel 6", "brand": "Google", "price": 599, "features": ["5G", "OLED", "NFC"] },
  { "model": "iPhone 13", "brand": "Apple", "price": 799, "features": ["5G", "FaceID", "NFC"] },
  { "model": "Galaxy S21", "brand": "Samsung", "price": 750, "features": ["5G", "AMOLED", "Wireless Charging"] },
  { "model": "iPhone SE", "brand": "Apple", "price": 399, "features": ["TouchID", "4G"] },
  { "model": "Galaxy A52", "brand": "Samsung", "price": 350, "features": ["4G", "AMOLED"] },
  { "model": "Pixel 5a", "brand": "Google", "price": 449, "features": ["5G", "OLED"] },
  { "model": "iPhone 13 Pro", "brand": "Apple", "price": 999, "features": ["5G", "FaceID", "LiDAR", "OLED"] },
  { "model": "OnePlus 9", "brand": "OnePlus", "price": 729, "features": ["5G", "Fast Charging"] }
]);
```

### Tasks

#### Part 1: Basic Stats
**Brand Pricing Report**  
Calculate the average price for each brand and reshape the output to show `BrandName` and `AvgPrice`.

#### Part 2: Array Unwinding
**Feature Mining**  
1. **Unwind:** Deconstruct the `features` array.  
2. **Group:** Count how many times each feature appears.  
3. **Sort:** Show the most popular features at the top.

#### Part 3: Pipeline Filtering
**Premium Filter**  
Find phones priced over $700. Project only the Model and Price. Sort by Price descending.

#### Part 4: Multi-Stage 5G Analysis (Advanced)
**5G Market Leaders**  
Analyze which brands offer the most affordable 5G phones.  

**Pipeline Stages Required:**
1. **Match:** Filter to find phones that have "5G" in their features array.
2. **Group:** Group by `brand` and calculate the **average price** of their 5G phones.
3. **Sort:** Sort by average price ascending (Cheapest brand first).
4. **Project:** Format the output: `{ "Brand": "Google", "Avg_5G_Price": 524 }`.

## Scenario 4: University Student Data

**Database:** `uniDB`  
**Collection:** `students`

### Setup Data
```javascript
db.students.insertMany([
  { "name": "John Doe", "major": "CS", "gpa": 3.8, "year": 4 },
  { "name": "Jane Smith", "major": "Math", "gpa": 3.9, "year": 3 },
  { "name": "Jim Brown", "major": "CS", "gpa": 2.7, "year": 2 },
  { "name": "Jake White", "major": "History", "gpa": 3.2, "year": 4 },
  { "name": "Jill Green", "major": "Math", "gpa": 4.0, "year": 1 },
  { "name": "Jack Black", "major": "CS", "gpa": 3.5, "year": 4 },
  { "name": "Jerry Blue", "major": "History", "gpa": 2.9, "year": 3 },
  { "name": "Jenny Gold", "major": "CS", "gpa": 3.9, "year": 3 }
]);
```

### Tasks

#### Part 1: Department Stats
**GPA by Major**  
1. **Group:** Group by `major`.  
2. **Accumulate:** Calculate Min, Max, and Avg GPA.  
3. **Project:** Rename fields to `Department`, `AvgGPA`, etc.

#### Part 2: Senior Analysis
**Top Seniors**  
Find Seniors (Year 4) with GPA > 3.5. Project only Name and Major. Sort by GPA descending.

#### Part 3: Enrollment
**Students per Year**  
Group by Year, Count students, and Sort by Year (ascending). Project output as `{ "Year": 1, "Count": 2 }`.

#### Part 4: Department Honor Roll (Advanced)
**Best Performing Majors**  
Identify which majors have the smartest students (GPA >= 3.5).  

**Pipeline Stages Required:**
1. **Match:** Filter to include only students with `gpa >= 3.5`.
2. **Group:** Group by `major` and count how many "Honor Students" are in that major.
3. **Sort:** Sort by the count of honor students in descending order.
4. **Limit:** Keep only the top 2 majors.
5. **Project:** Output: `{ "Major": "CS", "Honor_Student_Count": 3 }`.

## Submission Guidelines
- Create 4 JavaScript files as specified above
- Test your pipelines locally in MongoDB before submitting
- Ensure output formats match the specifications exactly where required
- The autograding system will run your pipelines and compare results to expected outputs
- Points will be awarded based on correct pipeline logic and output matching

## Learning Objectives
By completing this assignment, you will demonstrate proficiency in:
- Basic aggregation pipeline stages ($match, $group, $sort, $project)
- Array operations ($unwind)
- Multi-stage pipeline construction
- Data filtering and transformation
- Output formatting and projection