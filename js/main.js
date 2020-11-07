const url = "https://br.ongame.net/api/challenge/items/";
const data = async () => {
	let arr = [];
	let data = await fetch(url)
		.then((response) => response.json())
		.then((json) => json);
	data.forEach((element) => {
		arr.push(element);
	});
	return arr;
};

async function renderHtml() {
	const rewardList = document.querySelector(".reward-list");
	const elements = await data();

	elements.forEach((el) => {
		const li = document.createElement("li");
		const name = document.createElement("span");
		const button = document.createElement("button");
		const info = document.createElement("div");
		const progressBar = document.createElement("div");
		const progress = document.createElement("div");
		const opt = document.createElement("div");
		const img = document.createElement("img");

		li.className = "item";
		info.className = "info";
		name.className = "name";
		button.className = "button-reddem";
		progress.className = "progress";
		progressBar.className = "progressbar";
		opt.className = "opt";
		progress.style.width = `${el.percentage}%`;
		img.src = el.image;
		name.textContent = el.name;
		button.textContent = "RESGATAR";

		info.appendChild(name);
		info.appendChild(button);
		progressBar.appendChild(progress);
		opt.appendChild(info);
		opt.appendChild(progressBar);
		li.appendChild(img);
		li.appendChild(opt);

		if (el.percentage === 100) {
			progress.style.backgroundColor = "#d81823";
			if (el.redeemed === true) {
				const doneIcon = document.createElement("span");
				const msgReddemed = document.createElement("span");

				doneIcon.innerHTML = "&#10003";
				msgReddemed.textContent = "ITEM RESGATADO";
				doneIcon.className = "done-icon";
				msgReddemed.className = "msg-reddemed";
				doneIcon.style.color = "red";

				button.innerHTML = "";
				button.style.border = "0px";
				button.style.padding = "0px";
				button.style.color = "#fff";
				button.disabled = true;
				button.appendChild(doneIcon);
				button.appendChild(msgReddemed);

				progressBar.style.opacity = "0";
			} else {
				button.style.cursor = "pointer";
				button.className = "button__can-reddem";
			}
		} else {
			button.disabled = true;
		}

		button.addEventListener("click", () =>
			openModal(el.image, el.name, el.id)
		);

		rewardList.appendChild(li);
	});
}

function openModal(imgSrc, name, id) {
	let obj = {
		item_id: id,
	};
	const modal = document.createElement("div");
	const modalBox = document.createElement("div");
	const tittle = document.createElement("h1");
	const item = document.createElement("div");
	const img = document.createElement("img");
	const itemName = document.createElement("span");
	const buttonGroup = document.createElement("div");
	const buttonYes = document.createElement("button");
	const buttonNo = document.createElement("button");
	const error = document.createElement("div");
	const msg = document.createElement("span");

	error.className = "msg-error";
	modal.className = "modal";
	modalBox.className = "modal-box";
	item.className = "modal-item";
	itemName.className = "name";
	buttonGroup.className = "modal-buttons";
	buttonYes.className = "yes";
	buttonNo.className = "no";

	tittle.textContent = "DESEJA RESGATAR?";
	img.src = imgSrc;
	itemName.textContent = name;
	buttonYes.textContent = "SIM";
	buttonNo.textContent = "NÃO";
	msg.textContent = "Erro ao resgatar recompensa";

	modal.appendChild(modalBox);
	modalBox.appendChild(tittle);
	modalBox.appendChild(item);
	modalBox.appendChild(buttonGroup);
	item.appendChild(img);
	item.appendChild(itemName);
	buttonGroup.appendChild(buttonYes);
	buttonGroup.appendChild(buttonNo);
	error.appendChild(msg);

	buttonNo.addEventListener("click", () => {
		body.removeChild(modal);
	});
	buttonYes.addEventListener("click", () => {
		idPost(obj, modalBox, buttonNo, error);
	});

	let body = document.querySelector("body");
	body.appendChild(modal);
}

async function idPost(obj, modal, button, error) {
	const urlPost = "https://br.ongame.net/api/challenge/items/redeem/";
	let status;

	await fetch(urlPost, {
		method: "POST",
		mode: "no-cors",
		body: JSON.stringify(obj),
	}).then((res) => {
		status = res.ok;
	});

	if (status === false) {
		button.textContent = "X";
		error.appendChild(button);
		modal.innerHTML = "";
		modal.appendChild(error);
	}
}

window.addEventListener("load", () => renderHtml());
