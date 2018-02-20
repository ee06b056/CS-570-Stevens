//The code below is work from myself and my group
for (let i = 74; i <= 291; i++) {
	if (i % 15 === 0) {
		console.log('BuzzFizz');
	} else if (i % 5 === 0) {
		console.log('Fizz');
	} else if (i % 3 === 0) {
		console.log ('Buzz');
	} else {
		console.log(i);
	}
}
