interface Person {
  name: string;
  job: boolean;
}

interface Bird {
  name: string;
  wing: boolean;
}

// 유니온 타입의 경우는 Person ∪ Bird
type PersonOrBird = Person | Bird;

// 유니온 타입은 Person 과 Bird 각각 혹은 모두 Assignable 함
// PersonOrBird 는 Person 과 Bird 의 슈퍼 타입
// Person 과 Bird 는 PersonOrBird 의 서브 타입
const a: PersonOrBird = {
  name: "",
  wing: true,
};

const b: PersonOrBird = {
  name: "",
  job: true,
};

const c: PersonOrBird = {
  name: "",
  job: true,
  wing: true,
};
// PersonOrBird (슈퍼타입) 가 들어가는 곳에는 Person(서브타입) 과 Bird(서브타입) 이 들어갈 수 있음
function func1(args: PersonOrBird) {}
func1({ name: "", wing: true });
func1({ name: "", job: true });

// 인터섹션 타입의 경우는 Person ∩ Bird
// PersonAndBird 은 Person 과 Bird 의 서브 타입
type PersonAndBird = Person & Bird;

function func2(args: Person) {}
function func3(args: Bird) {}

// 인터섹션 타입은 Person 과 Bird 타입이 모두 Assignable 해야함
const d: PersonAndBird = {
  name: "",
  job: true,
  wing: true,
};

func2(d);
func3(d);

function func4(args: string) {}

function func5(): never {
  throw new Error("");
}

func4(func5());

interface A {
  id?: string | number;
  name: string;
}

interface B extends A {
  id?: string;
}

// DeleteTargetUser 타입의 서브타입
interface User {
  id: number;
  name: string;
}

// User 타입의 슈퍼 타입
interface DeleteTargetUser {
  id?: number;
  name: string;
}
function deleteUser(user: DeleteTargetUser) {
  delete user.id;
}

const user: User = {
  id: 1,
  name: "Martin",
};

// 슈퍼 타입이 들어갈 수 있는 곳에는 서브 타입도 들어갈 수 있다.
deleteUser(user);

// DeleteTargetUser 타입의 슈퍼 타입
interface LegacyUser {
  id?: string | number;
  name: string;
}

const legacyUser: LegacyUser = {
  id: "2",
  name: "Rita",
};

// 서브 타입이 필요한 곳에 슈퍼 타입은 할당할 수 없음
deleteUser(legacyUser);

// 타입스크립트에서는 요구되는 타입들에 대해서 공변해야한다. (<: 요구되는 타입)
