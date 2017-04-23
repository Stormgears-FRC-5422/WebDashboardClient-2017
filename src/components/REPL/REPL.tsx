import Fuse from "fuse.js";
import Component from "inferno-component";
import getCaretCoordinates from "textarea-caret";

import Completer from "./Completer";

interface REPLState {
	value: string;
	autoCompletion: string[];
	selected: number;
}

export interface REPLProps {
	handleLog;
}

// TODO: consider using Ace editor or another better editing component

export default class REPL extends Component<REPLProps, REPLState> {
	public state = {
		value: "",
		caret: 0,
		autoCompletion: [],
		selected: 0
	};

	private handleAutoCompletionRPCResponse = (err, res) => {
		if (err) {
			return;
		}

		this.completionCache = res;

		console.log(res);

		console.log(this.completionKey);

		let searched;

		if (this.completionKey.length > 0) {
			const fuse = new Fuse(res.map((r) => ({name: r})), {
				shouldSort: true,
				threshold: 0.6,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: [
					"name"
				]
			});

			searched = fuse.search(this.completionKey);
		} else {
			searched = res.map((r) => ({name: r}));
		}

		console.log(searched);

		this.setState({
			autoCompletion: searched || [],
			selected: 0
		});
	}

	private completionKey: string;
	private completionCache;
	private completionCacheKey;

	private doNotAutocomplete = /[)"']/; // heuristic to stop autocompletion
	private validIdentifier = /[a-zA-Z_$][0-9a-zA-Z_$]*/; // Yes I know this is wrong but it's good enough for these purposes
	private handleInput = (e) => {
		let value = e.target.value;

		if (e.target.selectionStart !== value.length || this.doNotAutocomplete.test(value)) {
			// do not autocomplete
			return this.setState({
				value,
				autoCompletion: []
			});
		} else {
			const c = getCaretCoordinates(e.target, e.target.selectionStart);
			this.setState({
				value,
				caret: c.left
			});

			console.log(c.left);
		}

		const parsed = value.split(/(?:['"();=]|\s+)/);
		value = parsed[parsed.length - 1];

		// calculate autocompletion
		const split = value.split(/([\.\[\]\(\)])/);

		let toAutoComplete = "";
		let prev = split[0];
		for (let i = 1; i < split.length; i++) {
			if (split[i] === "[" || split[i] === "]" || split[i] === "(" || split[i] === ")") {
				toAutoComplete = "";
				prev = split[i + 1];
				i++;
				continue;
			}
			if (split[i] === ".") {
				toAutoComplete += prev;
				prev = "." + split[i + 1];
				console.log(prev);
			}
		}

		if (prev.charAt(0) === ".") {
			prev = prev.substr(1);
		}

		if (!this.validIdentifier.test(prev) && prev !== "") {
			// this is not valid!
			return;
		}

		this.completionKey = prev;

		if (this.completionCacheKey === toAutoComplete) {
			console.log("Using cache");
			this.handleAutoCompletionRPCResponse(null, this.completionCache || []);
		} else {
			this.completionCacheKey = toAutoComplete;
			global.ds.rpc.make("repl-autocomplete", toAutoComplete, this.handleAutoCompletionRPCResponse);
		}

	}

	private handleSubmit = (e) => {
		e.preventDefault();

		this.props.handleLog({
			log: "> " + this.state.value
		});

		global.ds.rpc.make("repl-eval", this.state.value, this.handleEvalResponse);

		this.setState({
			value: "",
			autoCompletion: []
		});
	}

	private handleEvalResponse = (err, res) => {
		if (err) {
			this.props.handleLog({
				log: "< " + err
			});
			return;
		}

		this.props.handleLog({
			log: "< " + res
		});
	}

	private handleBlur = () => {
		this.setState({
			autoCompletion: []
		});
	}

	private handleKeyDown = (e) => {
		console.log(e);
		const {state} = this;
		const {selected, autoCompletion} = state;
		switch (e.keyCode) {
			case 37: // arrow left
			case 39: // arrow right
			case 27: // escape
				return this.handleBlur();
			case 38: // arrow up
				e.preventDefault();
				return this.setState({
					selected: selected > 0 ? selected - 1 : 0
				});
			case 40: // arrow down
				e.preventDefault();
				return this.setState({
					selected: selected < autoCompletion.length - 1 ? selected + 1 : selected
				});
			case 9: // tab
			case 13: // enter
				if (autoCompletion[selected]) {
					e.preventDefault();

					const newValue = state.value.split(".");
					newValue[newValue.length - 1] = autoCompletion[selected].name;

					return this.setState({
						autoCompletion: [],
						selected: 0,
						value: newValue.join(".")
					});
				}
		}
	}

	private handleItemClick = (e) => {
		const {state} = this;

		const newValue = state.value.split(".");
		newValue[newValue.length - 1] = e.target.innerText;

		this.inputElement.focus();

		return this.setState({
			autoCompletion: [],
			selected: 0,
			value: newValue.join(".")
		});
	}

	private inputElement;

	private inputRef = (e) => {
		this.inputElement = e;
	}

	public render() {
		const {state} = this;

		return <div>
			<form onSubmit={this.handleSubmit}>
				<div className="pt-input-group">
					<input ref={this.inputRef} type="text" placeholder="JavaScript REPL" className="pt-input pt-fill" value={state.value} onInput={this.handleInput} onKeyDown={this.handleKeyDown} />
					<button type="submit" className="pt-button pt-minimal pt-icon-arrow-right"/>
					{
						state.autoCompletion.length > 0 ? <div className="autocompleter-wrapper"><Completer entries={state.autoCompletion} activeEntry={state.selected} left={state.caret} handleItemClick={this.handleItemClick} /></div> : null
					}
					<div className="autocompleter-padding"/>
				</div>
			</form>
		</div>;
	}
}
