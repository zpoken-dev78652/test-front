export const howOldIs = (date: Date) => {

    const now = new Date(); //Текущя дата
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Текущя дата без времени

    const agenow = new Date(today.getFullYear(), date.getMonth(), date.getDate()); //ДР в текущем году
    let age; //Возраст

    //Возраст = текущий год - год рождения
    age = today.getFullYear() - date.getFullYear();
    //Если ДР в этом году ещё предстоит, то вычитаем из age один год
    if (today < agenow) {
        age = age - 1;
    }

    return age
}