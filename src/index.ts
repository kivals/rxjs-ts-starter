import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/ajax";

type GitHubUsersResponse = {
  items: Array<GitHubUser>
}

type GitHubUser = {
    login: string
}

const URL = 'https://api.github.com/search/users?q=';
const search = document.getElementById('search');

const stream$ = fromEvent(search, 'input')
    .pipe(
        map(e => {
          return (e.target as HTMLInputElement).value;
        }),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(v => ajax.getJSON(URL + v)),
        map((res: GitHubUsersResponse) => res.items),
    )

stream$.subscribe({
  next: (value: any) => value.map(u => console.log(u.login)),
  complete: () => console.log('Complete!'),
  error: (error) => console.log('Error!', error)
})