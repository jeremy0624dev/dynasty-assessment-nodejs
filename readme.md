<h1>Welcome</h1>
<h2>1.0 Features of Assessment</h2>
This system allows the admins to
<ul>
    <li>add new subject</li>
    <li>add new training</li>
    <li>list out subjects by applying pagination</li>
    <li>list out trainings by applying filters</li>
</ul>

Meanwhile, non-admin users can
<ul>
    <li>list out subjects by applying pagination</li>
    <li>list out trainings by applying filters</li>
</ul>

<h2>1.1 Add Ons</h2>
<h3>1.1.1 API Key</h3>
The assessment requires implementing JWT token as authentication. However, JWT token has expiration.
To allow admins to have a smooth user experience, instead of implementing JWT token, I used another
library (<i>uuid-apikey</i>) to create the API Key for each login session. The API key will be stored in database 
with a expiry date of 1 hour from the time it is created. If the admins keep on using the system, we will
update the expiry date from time to time so that the admin will not be logged out if he remains active using the system.

<h3>1.1.2 Single Sign-in Restriction</h3>
When the same admin logs in on another device, all the previous active logins will be removed to ensure that 
admin can only access from one device.

<h3>1.1.3 Data Validation</h3>
APIs will conduct basic data validation before creating new record on database. The validations are as followings:
<ol>
<li>Subject's and Training course's name must be unique.</li>
<li>Some data is required.</li>
<li>When choosing subjects for a new training course, system will validate the submitted subject options.</li>
<li>Validate admin's login's API key.</li>
</ol>

<hr>
<h2>2.0 Assumptions</h2>
<ul>
    <li>There are only 3 admins created in the system: <i>Superadmin, Admin001, Admin002</i></li>
    <li>All existing subjects and trainings are considered to be created/modified by <i>Superadmin</i>.</li>
    <li>Admin's login session will be extended for 1 hour continuously when he performs <i>POST/PUT/DELETE</i> actions in the system.</li>
    <li>There are only 3 available streams: Science, Arts and Commerce.</li>
</ul>

<hr>
<h2>3.0 Setup</h2>
<ol>
    <li>Please run <i>npm install</i> to install packages.</li>
    <li>Run <i>npm run start</i></li>
    <li>Run <i>node dist/server.js</i> to start this project locally.</li>
    <li>Use API platform such as postman to test the APIs.</li>
    <li>Can call <i>POST http://localhost:8080/api/admin/setCollectionsToDefault</i> to reset data to default.</li>
</ol>

<h2>4.0 Process Flow (Steps to Test the APIs)</h2>
In order to be allowed to call POST APIs, you have to log in as an admin first in order to get the API Key.
Kindly refers to <strong>5.1 Login as admin</strong>.

After you get the API key, you can perform the APIs to add new subject
and new training. If you call the APIs without a valid API key, you will be prompted with error.

As for both admins and non-admin users, they can call all GET APIs.

<hr>

<h2> 5.0 APIs</h2>
<h3>5.1 Admin Login</h3>
Login as admin in order to get API key to perform POST APIs.
<table>
<tr>
    <th>Method</th>
    <td colspan="2">POST</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/admin/login</td>
</tr>
<tr>
    <th>Body(Json)</th>
    <td>username: string</td>
    <td>Superadmin / Admin001 / Admin002</td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>apiKey: string</td>
    <td>C33EWRH-QYZM890-H5H97QD-VHHEVSQ</td>
</tr>
</table>

<h3>5.2 Get Subjects</h3>
Get list of subjects by applying pagination
<table>
<tr>
    <th>Method</th>
    <td colspan="2">GET</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/subjects</td>
</tr>
<tr>
    <th>Query</th>
    <td>
        sortOrder: string (options: ASC/ DSC)<br>
        pageSize: number Number of items to be displayed on one page<br>
        page: number Page sequence number (eg. 1/ 2/ 3...)
    </td>
    <td><code>?sortOrder=asc&pageSize=10&page=1</code></td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>subjects: Subject[]</td>
    <td>
        <code>
        {
    "subjects": [
        {
            "_id": "62da20310e29a01dca3fb104",
            "name": "Chemistry",
            "streamId": "62d9979f627ee58c43e3da5f",
            "modifiedBy": "62d9979f627ee58c43e3da5d",
            "createdAt": "2022-07-22T03:57:37.069Z",
            "updatedAt": "2022-07-22T03:57:37.069Z",
            "__v": 0,
            "stream": {
                "_id": "62d9979f627ee58c43e3da5f",
                "name": "Science"
            }
        }
    ]
}
    </code>
    </td>
</tr>
</table>

<h3>5.3 Add Subject</h3>
<table>
<tr>
    <th>Method</th>
    <td colspan="2">POST</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/subjects/new</td>
</tr>
<tr>
    <th>Headers</th>
    <td>
        x-api-key
    </td>
    <td>
        <code>C33EWRH-QYZM890-H5H97QD-VHHEVSQ</code>
    </td>
</tr>
<tr>
    <th>Body(JSON)</th>
    <td>
        name: string<br>
        stream: string<br>
    </td>
    <td>
        <code>
            {
    "name": "Chemistry",
    "stream": "arts"
}
        </code>
    </td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>subject</td>
    <td>
        <code>
        {
    "subject": {
        "name": "Biology",
        "streamId": "62d9979f627ee58c43e3da5f",
        "modifiedBy": "62d9979f627ee58c43e3da5d",
        "_id": "62da51f2d2ab84b05d7d1507",
        "createdAt": "2022-07-22T07:29:54.787Z",
        "updatedAt": "2022-07-22T07:29:54.787Z",
        "__v": 0,
        "id": "62da51f2d2ab84b05d7d1507"
    }
}
    </code>
    </td>
</tr>
</table>

<h3>5.4 Get Training Courses</h3>
Get list of training courses by applying filters
<table>
<tr>
    <th>Method</th>
    <td colspan="2">POST</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/trainings</td>
</tr>
<tr>
    <th>Body(JSON)</th>
    <td>
        Advise to pass in only one filter. By passing in all filters, they work with AND relationship
when getting the matched results.
        subject: string<br>
        stream: string<br>
        type: string (options: Basic/ Detailed)
    </td>
    <td>
        <code>
            {
    "subject": "Chemistry",
    "stream": "arts",
    "type": "detailed"
}
        </code>
    </td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>subjects: Subject[]</td>
    <td>
        <code>
        {
    "trainings": [
        {
            "_id": "62da2300d398131c1672a02e",
            "name": "Explore Science 2",
            "type": "Detailed",
            "modifiedBy": "62d9979f627ee58c43e3da5d",
            "createdAt": "2022-07-22T04:09:36.112Z",
            "updatedAt": "2022-07-22T04:09:36.112Z",
            "__v": 0,
            "subjectNames": [
                "Chemistry"
            ],
            "modifiedByUsername": "Admin002"
        }]}
    </code>
    </td>
</tr>
</table>

<h3>5.5 Add Training Course</h3>
<table>
<tr>
    <th>Method</th>
    <td colspan="2">POST</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/trainings/new</td>
</tr>
<tr>
    <th>Headers</th>
    <td>
        x-api-key
    </td>
    <td>
        <code>C33EWRH-QYZM890-H5H97QD-VHHEVSQ</code>
    </td>
</tr>
<tr>
    <th>Body(JSON)</th>
    <td>
        name: string<br>
        subjects: string[]<br>
        type: string (options: Basic/ Detailed)<br>
    </td>
    <td>
        <code>
            {
    "name": "Science Expo",
    "subjects": ["chemistry", "biology"],
    "type": "basic"
}
        </code>
    </td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>training: Training</td>
    <td>
        <code>
        {
    "training": {
        "name": "Science Expo",
        "type": "Basic",
        "modifiedBy": "62d9979f627ee58c43e3da5d",
        "_id": "62da5290d2ab84b05d7d1511",
        "createdAt": "2022-07-22T07:32:32.600Z",
        "updatedAt": "2022-07-22T07:32:32.600Z",
        "__v": 0
    }
}
    </code>
    </td>
</tr>
</table>

<h2>6.0 Project Structure</h2>
Folder <strong>models</strong> stores all the collection models and its own query functions.
<br><br>
Folder <strong>controllers</strong> stores all logical functions that involve more than one collection.
<br><br>
Folder <strong>middlewares</strong> stores functions of middleware being called when API requests come in.
<br><br>
Folder <strong>routes</strong> declares the API routes of each collection.

<h2>7.0 Skills</h2>
<ul>
<li>nodejs</li>
<li>mongoDb</li>
<li>express</li>
<li>typescript</li>
<li>ecma6</li>
</ul>