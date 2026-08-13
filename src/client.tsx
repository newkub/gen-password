/// <reference types="@tanstack/solid-start" />
import { hydrateStart, StartClient } from "@tanstack/solid-start/client";
import { hydrate } from "solid-js/web";
import { getRouter } from "~/router";

import "virtual:uno.css";

hydrateStart().then(() => {
	hydrate(
		() => (
			<StartClient router={getRouter()} />
		),
		document.body,
	);
});
