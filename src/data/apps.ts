export interface App {
  id: number;
  name: string;
  repo: string;
}

export const apps = [
  {
    id: 1,
    name: 'authy',
    desc: 'some attempt at a shared authentication abstraction',
    repo: 'git@github.com:whattheearl/authy.git'
  },
  {
    id: 2,
    name: 'jeddit',
    desc: 'like reddit but for me',
    repo: 'git@github.com:whattheearl/jeddit.git'
  }

];
