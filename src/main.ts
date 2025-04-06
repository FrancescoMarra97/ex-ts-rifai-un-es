import dayjs from 'dayjs'
type Ricetta = {
  id: number;
  userId: number
}

type User = {
  id: number;
  birthDate: string;
}


async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Errore HTTP: ${res.status}: ${res.statusText}`);
  }
  const obj: T = await res.json()
  return obj;
}

async function getChefBirthday(id: number): Promise<string> {
  let ricetta: Ricetta | undefined
  try {
    ricetta = await fetchJson<Ricetta>(`https://dummyjson.com/recipes/${id}`)
    if (!ricetta) {
      throw new Error(`Ricetta con id ${id} non trovata o non valida`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Non posso recuperare ricetta id ${id}`, error.message);
    } else {
      console.error("Errore sconosciuto", error)
    }
  }
  let user: User | undefined
  try {
    user = await fetchJson<User>(`https://dummyjson.com/users/${ricetta?.userId}`)
    if (!user) {
      throw new Error(`user con id ${id} non trovato o non valido`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Non posso recuperare user id ${ricetta?.userId}`)
    }
  }


  return dayjs(user?.birthDate).format('DD/MM/YYYY')
}

(async () => {
  try {
    const ricetta = await getChefBirthday(1)
    console.log("Data di nascita: ", ricetta);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  } finally { console.log("fine"); }

})()
