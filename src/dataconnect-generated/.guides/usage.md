# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getUserByEmail, hasApprovedCommunityByEmail, createUser, updateUserByEmail, getMyCommunities, createCommunity } from '@firebasegen/campus-channels-connector';


// Operation GetUserByEmail:  For variables, look at type GetUserByEmailVars in ../index.d.ts
const { data } = await GetUserByEmail(dataConnect, getUserByEmailVars);

// Operation HasApprovedCommunityByEmail:  For variables, look at type HasApprovedCommunityByEmailVars in ../index.d.ts
const { data } = await HasApprovedCommunityByEmail(dataConnect, hasApprovedCommunityByEmailVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserByEmail:  For variables, look at type UpdateUserByEmailVars in ../index.d.ts
const { data } = await UpdateUserByEmail(dataConnect, updateUserByEmailVars);

// Operation GetMyCommunities:  For variables, look at type GetMyCommunitiesVars in ../index.d.ts
const { data } = await GetMyCommunities(dataConnect, getMyCommunitiesVars);

// Operation CreateCommunity:  For variables, look at type CreateCommunityVars in ../index.d.ts
const { data } = await CreateCommunity(dataConnect, createCommunityVars);


```