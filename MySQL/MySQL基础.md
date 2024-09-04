# MySQL 基础



## 基本的SELECT语句



### SELECT...

~~~SQL
# 没有任何子句
SELECT 1; 
SELECT 1+2, 2+3;
~~~



### SELECT...FROM

**语法：**

~~~sql
SELECT	标识查询哪些列
FROM	标识从那个表中查询
~~~

**示例：**

~~~sql
# 查询所有列
SELECT * FROM departments;

# 查询特定的列
SELECT department_id, department_name FROM departments;
~~~



### 列的别名

> 在列名和别名之间加入关键字`AS`，别名使用双引号。
>
> `AS`：全称：`alias`（别名），可以省略。

~~~sql
SELECT employee_id "emp_id", first_name AS "name" FROM employees;
~~~



### 去除重复行

> 在`SELECT`语句中使用`DISTINCT`去除重复行。
>
> `DISTINCT`会对后面查询的所有列的组合进行去重。

~~~sql
SELECT DISTINCT department_id FROM employees;
~~~



### 空值参与运算

> `NULL`参与运算，结果都为`NULL`。
>
> 空值不等于空字符串。一个空字符串的长度是 0，而一个空值的长度是空。
>
> 在 MySQL 里面，空值是占用空间的。

```sql
# 当 commission_pct 值为 null 时，计算结果都为 null。
SELECT employee_id, salary, commission_pct, 12 * salary * (1 + commission_pct) "annual_sal" FROM employees;
# 解决方法
SELECT employee_id, salary, commission_pct, 12 * salary * (1 + IFNULL(commission_pct, 0)) "annual_sal" FROM employees;
```



### 着重号

> 需要保证表中的字段、表名等没有和保留字、数据库系统或常用方法冲突。
>
> 如果真的相同，请在 SQL语句中使用一对``（着重号）引起来。

~~~sql
SELECT * FROM `ORDER`;
~~~



### 常数列

> 在 `SELECT`  查询结果中增加一列固定的常数列。
>
> 这列的取值是我们指定的，而不是从数据表中动态取出的。

```sql
SELECT 'CV', employee_id,first_name FROM employees;
SELECT 'CV' as "corporation", employee_id,first_name FROM employees;
```



## 显示表结构

> 使用 `DESCRIBE` 或 `DESC` 显示表结构。

~~~sql
DESCRIBE employees;
DESC employees;
~~~

![image-20221102094358760](https://images.bestshi.com/undefinedimage-20221102094358760.png!watermark)

**各字段含义：**

- Field：表示字段名称。
- Type：表示字段类型。
- Null：表示该列是否可以存储 `NULL` 值。
- Key：表示该列是否已编制索引。
  - PRI：表示该列是主键的一部分。
  - NUI：表示该列是 `NUIQUE`索引的一部分。
  - MUL：表示在列中某个值允许出现多次。
- Default：表示该列是否有默认值，默认值是多少。
- Extra：表示可以获取的与给定列有关的附加信息。



## 过滤数据

**语法：**

```sql
SELECT 字段1, 字段2, ...
FROM 表名
WHERE 过滤条件;
```

**示例：**

```sql
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id = 90;
```



## 运算符

### 算术运算符

| 运算符    | 描述       | 作用                     |
| --------- | ---------- | ------------------------ |
| +         | 加法运算符 | 计算两个值或表达式的和   |
| -         | 减法运算符 | 计算两个值或表达式的差   |
| *         | 乘法运算符 | 计算两个值或表达式的乘积 |
| /  或 DIV | 除法运算符 | 计算两个值或表达式的商   |
| % 或 MOD  | 取余运算符 | 计算两个值或表达式的余数 |

- 一个整数类型的值对整数进行加法和减法操作，结果还是一个整数；
-  一个整数类型的值对浮点数进行加法和减法操作，结果是一个浮点数；
-  加法和减法的优先级相同，进行先加后减操作与进行先减后加操作的结果是一样的；
- 如果遇到非数值类型，先尝试转成数值，如果转失败，就按0计算。（补充：MySQL 中字符串拼接要使用字符串函数CONCAT()实现）；
- 一个数乘以整数1和除以整数1后仍得原数；
-  一个数乘以浮点数1和除以浮点数1后变成浮点数，数值与原数相等； 
- 一个数除以整数后，不管是否能除尽，结果都为一个浮点数；
-  一个数除以另一个数，除不尽时，结果为一个浮点数，并保留到小数点后4位； 
- 乘法和除法的优先级相同，进行先乘后除操作与先除后乘操作，得出的结果相同；
-  在数学运算中，0不能用作除数，在MySQL中，一个数除以0为NULL；

![image-20221103002414163](https://images.bestshi.com/undefinedimage-20221103002414163.png!watermark)



### 比较运算符

> 比较运算符用来对表达式左边的操作数和右边的操作数进行比较。
>
> 比较的结果为真则返回 **1**，比较的结果为假则返回 **0**，其他情况则返回 **NULL**。

| 运算符   | 描述           | 作用                             |
| -------- | -------------- | -------------------------------- |
| =        | 等于运算符     | 判断两个值是否相等               |
| <=>      | 安全等于运算符 | 安全的判断两个值是否相等         |
| <> 或 != | 不等于运算符   | 判断两个值是否不相等             |
| <        | 小于运算符     | 判断左边的值是否小于右边的值     |
| <=       | 小于等于运算符 | 判断左边的值是否小于等于右边的值 |
| >        | 大于运算符     | 判断左边的值是否大于右边的值     |
| >=       | 大于等于运算符 | 判断左边的值是否大于等于右边的值 |

- 等于运算符判断两个值是否相等，如果相等则返回 **1**，不相等则返回 **0**。
  - 如果等号两边都为字符串，其比较的是每个字符串中字符的ANSI编码是否相等。
  - 如果等号两边的值一个是整数，另一个是字符串，则会将字符串转化为数字进行比较。
  - 如果等号两边有一个为**NULL**，则比较结果为**NULL**。
- **<=>**可 以用来对**NULL**进行判断。
  - 在两个操作数均为**NULL**时，其返回值为**1**，而不为**NULL**。
  - 当一个操作数为**NULL** 时，其返回值为**0**，而不为**NULL**。
- 不等于运算符不能判断**NULL**值。如果两边的值有任意一个为**NULL**， 或两边都为**NULL**，则结果为**NULL**。

![image-20221103002939270](https://images.bestshi.com/undefinedimage-20221103002939270.png!watermark)



### 非符号类型运算符

| 运算符      | 描述                 | 作用                             |
| ----------- | -------------------- | -------------------------------- |
| IN NULL     | 为空运算符           | 判断值是否为空                   |
| IS NOT NULL | 不为空运算符         | 判断值是否不为空                 |
| LEAST       | 最小值运算符         | 在多个值中返回最小值             |
| GREATEST    | 最大值运算符         | 在多个值中返回最大值             |
| BETWEEN AND | 两个值中间的的运算符 | 判断一个值是否在两个值之间       |
| ISNULL      | 为空运算符           | 判断值是否为空                   |
| IN          | 属于运算符           | 判断一个值是否属于列表中的值     |
| NOT IN      | 不属于运算符         | 判断一个值是否不属于列表中的值   |
| LIKE        | 模糊匹配运算符       | 判断一个值是否符合模糊匹配规则   |
| REGEXP      | 正则表达式运算符     | 判断一个值是否符合正则表达式规则 |
| RLIKE       | 正则表达式运算符     | 判断一个值是否符合正则表达式规则 |

