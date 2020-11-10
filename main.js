#!/usr/bin/env node
module.exports = (function() {
    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.1' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.nil'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.1' : 'Word.0',
                pred: w
            };
        };
        return w;
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
    };
    var fm_name_to_bits = name => {
        const TABLE = {
            'A': '000000',
            'B': '100000',
            'C': '010000',
            'D': '110000',
            'E': '001000',
            'F': '101000',
            'G': '011000',
            'H': '111000',
            'I': '000100',
            'J': '100100',
            'K': '010100',
            'L': '110100',
            'M': '001100',
            'N': '101100',
            'O': '011100',
            'P': '111100',
            'Q': '000010',
            'R': '100010',
            'S': '010010',
            'T': '110010',
            'U': '001010',
            'V': '101010',
            'W': '011010',
            'X': '111010',
            'Y': '000110',
            'Z': '100110',
            'a': '010110',
            'b': '110110',
            'c': '001110',
            'd': '101110',
            'e': '011110',
            'f': '111110',
            'g': '000001',
            'h': '100001',
            'i': '010001',
            'j': '110001',
            'k': '001001',
            'l': '101001',
            'm': '011001',
            'n': '111001',
            'o': '000101',
            'p': '100101',
            'q': '010101',
            'r': '110101',
            's': '001101',
            't': '101101',
            'u': '011101',
            'v': '111101',
            'w': '000011',
            'x': '100011',
            'y': '010011',
            'z': '110011',
            '0': '001011',
            '1': '101011',
            '2': '011011',
            '3': '111011',
            '4': '000111',
            '5': '100111',
            '6': '010111',
            '7': '110111',
            '8': '001111',
            '9': '101111',
            '.': '011111',
            '_': '111111',
        }
        var a = '';
        for (var i = name.length - 1; i >= 0; --i) {
            a += TABLE[name[i]];
        }
        return a;
    };
    var inst_unit = x => x(1);
    var elim_unit = (x => (() => c0 => {
        var self = x;
        switch (unit) {
            case 'unit':
                return c0;
        }
    })());
    var inst_bool = x => x(true)(false);
    var elim_bool = (x => (() => c0 => c1 => {
        var self = x;
        switch (self ? 'true' : 'false') {
            case 'true':
                return c0;
            case 'false':
                return c1;
        }
    })());
    var inst_nat = x => x(0n)(x0 => 1n + x0);
    var elim_nat = (x => (() => c0 => c1 => {
        var self = x;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return c0;
            case 'succ':
                var $0 = (self - 1n);
                return c1($0);
        }
    })());
    var inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    var elim_bits = (x => (() => c0 => c1 => c2 => {
        var self = x;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return c0;
            case '0':
                var $1 = self.slice(0, -1);
                return c1($1);
            case '1':
                var $2 = self.slice(0, -1);
                return c2($2);
        }
    })());
    var inst_u16 = x => x(x0 => word_to_u16(x0));
    var elim_u16 = (x => (() => c0 => {
        var self = x;
        switch ('u16') {
            case 'u16':
                var $3 = u16_to_word(self);
                return c0($3);
        }
    })());
    var inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    var elim_string = (x => (() => c0 => c1 => {
        var self = x;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return c0;
            case 'cons':
                var $4 = self.charCodeAt(0);
                var $5 = self.slice(1);
                return c1($4)($5);
        }
    })());
    var rdl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    var run = (p) => {
        switch (p._) {
            case 'IO.end':
                return Promise.resolve(p.value);
            case 'IO.ask':
                return new Promise((res, _) => {
                    switch (p.query) {
                        case 'print':
                            console.log(p.param);
                            run(p.then(1)).then(res);
                            break;
                        case 'get_line':
                            rdl.question('', (line) => run(p.then(line)).then(res));
                            break;
                        case 'get_file':
                            try {
                                run(p.then(require('fs').readFileSync(p.param, 'utf8'))).then(res);
                            } catch (e) {
                                console.log('File not found: "' + p.param + '"');
                                process.exit();
                            };
                            break;
                        case 'get_args':
                            run(p.then(process.argv[2] || '')).then(res);
                            break;
                    }
                });
        }
    };
    var Monad$bind = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Monad.new':
                var $6 = self.bind;
                var $7 = self.pure;
                return $6;
        }
    })());
    var IO = (A$1 => null);
    var Monad$new = (bind$2 => (pure$3 => ({
        _: 'Monad.new',
        'bind': bind$2,
        'pure': pure$3
    })));
    var IO$ask = (query$2 => (param$3 => (then$4 => ({
        _: 'IO.ask',
        'query': query$2,
        'param': param$3,
        'then': then$4
    }))));
    var IO$bind = (a$3 => (f$4 => (() => {
        var self = a$3;
        switch (self._) {
            case 'IO.end':
                var $8 = self.value;
                return f$4($8);
            case 'IO.ask':
                var $9 = self.query;
                var $10 = self.param;
                var $11 = self.then;
                return IO$ask($9)($10)((x$8 => IO$bind($11(x$8))(f$4)));
        }
    })()));
    var IO$end = (value$2 => ({
        _: 'IO.end',
        'value': value$2
    }));
    var IO$monad = Monad$new(IO$bind)(IO$end);
    var IO$get_args = IO$ask("get_args")("")((line$1 => IO$end(line$1)));
    var IO$get_file = (name$1 => IO$ask("get_file")(name$1)((file$2 => IO$end(file$2))));
    var Maybe$default = (a$2 => (m$3 => (() => {
        var self = m$3;
        switch (self._) {
            case 'Maybe.none':
                return a$2;
            case 'Maybe.some':
                var $12 = self.value;
                return $12;
        }
    })()));
    var Map = (A$1 => null);
    var Map$new = ({
        _: 'Map.new'
    });
    var Parser = (V$1 => null);
    var Parser$Reply = (V$1 => null);
    var Parser$Reply$error = (code$2 => (err$3 => ({
        _: 'Parser.Reply.error',
        'code': code$2,
        'err': err$3
    })));
    var Parser$bind = (parse$3 => (next$4 => (code$5 => (() => {
        var self = parse$3(code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $13 = self.code;
                var $14 = self.err;
                return Parser$Reply$error($13)($14);
            case 'Parser.Reply.value':
                var $15 = self.code;
                var $16 = self.val;
                return next$4($16)($15);
        }
    })())));
    var Parser$Reply$value = (code$2 => (val$3 => ({
        _: 'Parser.Reply.value',
        'code': code$2,
        'val': val$3
    })));
    var Parser$pure = (value$2 => (code$3 => Parser$Reply$value(code$3)(value$2)));
    var Parser$monad = Monad$new(Parser$bind)(Parser$pure);
    var Maybe = (A$1 => null);
    var Maybe$none = ({
        _: 'Maybe.none'
    });
    var Maybe$some = (value$2 => ({
        _: 'Maybe.some',
        'value': value$2
    }));
    var Parser$maybe = (parse$2 => (code$3 => (() => {
        var self = parse$2(code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $17 = self.code;
                var $18 = self.err;
                return Parser$Reply$value(code$3)(Maybe$none);
            case 'Parser.Reply.value':
                var $19 = self.code;
                var $20 = self.val;
                return Parser$Reply$value($19)(Maybe$some($20));
        }
    })()));
    var List = (A$1 => null);
    var List$nil = ({
        _: 'List.nil'
    });
    var List$cons = (head$2 => (tail$3 => ({
        _: 'List.cons',
        'head': head$2,
        'tail': tail$3
    })));
    var Parser$many$go = parse$2 => values$3 => code$4 => {
        var Parser$many$go = parse$2 => values$3 => code$4 => ({
            ctr: 'TCO',
            arg: [parse$2, values$3, code$4]
        });
        var arg = [parse$2, values$3, code$4];
        while (true) {
            let [parse$2, values$3, code$4] = arg;
            var R = (() => {
                var self = parse$2(code$4);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $21 = self.code;
                        var $22 = self.err;
                        return Parser$Reply$value(code$4)(values$3(List$nil));
                    case 'Parser.Reply.value':
                        var $23 = self.code;
                        var $24 = self.val;
                        return Parser$many$go(parse$2)((xs$7 => values$3(List$cons($24)(xs$7))))($23);
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Parser$many = (parser$2 => Parser$many$go(parser$2)((x$3 => x$3)));
    var Parser$first_of = pars$2 => code$3 => {
        var Parser$first_of = pars$2 => code$3 => ({
            ctr: 'TCO',
            arg: [pars$2, code$3]
        });
        var arg = [pars$2, code$3];
        while (true) {
            let [pars$2, code$3] = arg;
            var R = (() => {
                var self = pars$2;
                switch (self._) {
                    case 'List.nil':
                        return Parser$Reply$error(code$3)("No parse.");
                    case 'List.cons':
                        var $25 = self.head;
                        var $26 = self.tail;
                        return (() => {
                            var parsed$6 = $25(code$3);
                            return (() => {
                                var self = parsed$6;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $27 = self.code;
                                        var $28 = self.err;
                                        return Parser$first_of($26)(code$3);
                                    case 'Parser.Reply.value':
                                        var $29 = self.code;
                                        var $30 = self.val;
                                        return Parser$Reply$value($29)($30);
                                }
                            })()
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Unit$new = 1;
    var String$cons = (head$1 => (tail$2 => (String.fromCharCode(head$1) + tail$2)));
    var String$concat = a0 => a1 => (a0 + a1);
    var String$flatten$go = xs$1 => res$2 => {
        var String$flatten$go = xs$1 => res$2 => ({
            ctr: 'TCO',
            arg: [xs$1, res$2]
        });
        var arg = [xs$1, res$2];
        while (true) {
            let [xs$1, res$2] = arg;
            var R = (() => {
                var self = xs$1;
                switch (self._) {
                    case 'List.nil':
                        return res$2;
                    case 'List.cons':
                        var $31 = self.head;
                        var $32 = self.tail;
                        return String$flatten$go($32)((res$2 + $31));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var String$flatten = (xs$1 => String$flatten$go(xs$1)(""));
    var Bool$false = false;
    var Bool$true = true;
    var Cmp$as_eql = (cmp$1 => (() => {
        var self = cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                return Bool$false;
            case 'Cmp.eql':
                return Bool$true;
            case 'Cmp.gtn':
                return Bool$false;
        }
    })());
    var Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    var Cmp$gtn = ({
        _: 'Cmp.gtn'
    });
    var Word$cmp$go = (a$2 => (b$3 => (c$4 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Word.nil':
                return (b$5 => c$4);
            case 'Word.0':
                var $33 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $34 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($34)(c$4));
                        case 'Word.1':
                            var $35 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($35)(Cmp$ltn));
                    }
                })()($33));
            case 'Word.1':
                var $36 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $37 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($37)(Cmp$gtn));
                        case 'Word.1':
                            var $38 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($38)(c$4));
                    }
                })()($36));
        }
    })()(b$3))));
    var Cmp$eql = ({
        _: 'Cmp.eql'
    });
    var Word$cmp = (a$2 => (b$3 => Word$cmp$go(a$2)(b$3)(Cmp$eql)));
    var Word$eql = (a$2 => (b$3 => Cmp$as_eql(Word$cmp(a$2)(b$3))));
    var U16$eql = a0 => a1 => (a0 === a1);
    var String$nil = '';
    var Parser$text$go = (text$1 => (code$2 => (() => {
        var self = text$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$value(code$2)(Unit$new);
            case 'cons':
                var $39 = self.charCodeAt(0);
                var $40 = self.slice(1);
                return (() => {
                    var self = code$2;
                    switch (self.length === 0 ? 'nil' : 'cons') {
                        case 'nil':
                            return (() => {
                                var error$5 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found end of file.")(List$nil))));
                                return Parser$Reply$error(code$2)(error$5)
                            })();
                        case 'cons':
                            var $41 = self.charCodeAt(0);
                            var $42 = self.slice(1);
                            return (() => {
                                var self = ($39 === $41);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$text($40)($42);
                                    case 'false':
                                        return (() => {
                                            var error$7 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found \'")(List$cons(String$cons($41)(String$nil))(List$cons("\'.")(List$nil))))));
                                            return Parser$Reply$error(code$2)(error$7)
                                        })();
                                }
                            })();
                    }
                })();
        }
    })()));
    var Parser$text = (text$1 => (code$2 => (() => {
        var self = Parser$text$go(text$1)(code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $43 = self.code;
                var $44 = self.err;
                return Parser$Reply$error(code$2)($44);
            case 'Parser.Reply.value':
                var $45 = self.code;
                var $46 = self.val;
                return Parser$Reply$value($45)($46);
        }
    })()));
    var Parser$char_if = (fun$1 => (code$2 => (() => {
        var self = code$2;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$2)("No parse.");
            case 'cons':
                var $47 = self.charCodeAt(0);
                var $48 = self.slice(1);
                return (() => {
                    var self = fun$1($47);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($48)($47);
                        case 'false':
                            return Parser$Reply$error(code$2)("No parse.");
                    }
                })();
        }
    })()));
    var Bool$not = a0 => (!a0);
    var Fm$Parser$spaces = Parser$many(Parser$first_of(List$cons(Parser$text(" "))(List$cons(Parser$text("\u{a}"))(List$cons(Monad$bind(Parser$monad)(Parser$text("//"))(($1 => Monad$bind(Parser$monad)(Parser$many(Parser$char_if((chr$2 => (!(chr$2 === 10))))))(($2 => Parser$text("\u{a}"))))))(List$nil)))));
    var Bool$and = a0 => a1 => (a0 && a1);
    var Cmp$as_lte = (cmp$1 => (() => {
        var self = cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                return Bool$true;
            case 'Cmp.eql':
                return Bool$true;
            case 'Cmp.gtn':
                return Bool$false;
        }
    })());
    var Word$lte = (a$2 => (b$3 => Cmp$as_lte(Word$cmp(a$2)(b$3))));
    var U16$lte = a0 => a1 => (a0 <= a1);
    var U16$btw = (a$1 => (b$2 => (c$3 => ((a$1 <= b$2) && (b$2 <= c$3)))));
    var Fm$Name$is_letter = (chr$1 => (() => {
        var self = U16$btw(65)(chr$1)(90);
        switch (self ? 'true' : 'false') {
            case 'true':
                return Bool$true;
            case 'false':
                return (() => {
                    var self = U16$btw(97)(chr$1)(122);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Bool$true;
                        case 'false':
                            return (() => {
                                var self = U16$btw(48)(chr$1)(57);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Bool$true;
                                    case 'false':
                                        return (() => {
                                            var self = (46 === chr$1);
                                            switch (self ? 'true' : 'false') {
                                                case 'true':
                                                    return Bool$true;
                                                case 'false':
                                                    return (() => {
                                                        var self = (95 === chr$1);
                                                        switch (self ? 'true' : 'false') {
                                                            case 'true':
                                                                return Bool$true;
                                                            case 'false':
                                                                return Bool$false;
                                                        }
                                                    })();
                                            }
                                        })();
                                }
                            })();
                    }
                })();
        }
    })());
    var Fm$Parser$letter = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("Unexpected eof.");
            case 'cons':
                var $49 = self.charCodeAt(0);
                var $50 = self.slice(1);
                return (() => {
                    var self = Fm$Name$is_letter($49);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($50)($49);
                        case 'false':
                            return Parser$Reply$error(code$1)("Expected letter.");
                    }
                })();
        }
    })());
    var Monad$pure = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Monad.new':
                var $51 = self.bind;
                var $52 = self.pure;
                return $52;
        }
    })());
    var List$fold = (list$2 => (nil$4 => (cons$5 => (() => {
        var self = list$2;
        switch (self._) {
            case 'List.nil':
                return nil$4;
            case 'List.cons':
                var $53 = self.head;
                var $54 = self.tail;
                return cons$5($53)(List$fold($54)(nil$4)(cons$5));
        }
    })())));
    var Fm$Parser$name = Monad$bind(Parser$monad)(Parser$many(Fm$Parser$letter))((chrs$1 => Monad$pure(Parser$monad)(List$fold(chrs$1)(String$nil)(String$cons))));
    var Parser$many1 = (parser$2 => Monad$bind(Parser$monad)(parser$2)((head$3 => Monad$bind(Parser$monad)(Parser$many(parser$2))((tail$4 => Monad$pure(Parser$monad)(List$cons(head$3)(tail$4)))))));
    var Fm$Parser$spaces_text = (text$1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Parser$text(text$1))));
    var Pair = (A$1 => (B$2 => null));
    var Fm$Parser$item = (parser$2 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($3 => Monad$bind(Parser$monad)(parser$2)((value$4 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$spaces_text(",")))(($5 => Monad$pure(Parser$monad)(value$4))))))));
    var Fm$Term$typ = ({
        _: 'Fm.Term.typ'
    });
    var Fm$Parser$type = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("Type"))(($1 => Monad$pure(Parser$monad)(Fm$Term$typ)));
    var Parser$spaces = Parser$many(Parser$first_of(List$cons(Parser$text(" "))(List$cons(Parser$text("\u{a}"))(List$nil))));
    var Parser$spaces_text = (text$1 => Monad$bind(Parser$monad)(Parser$spaces)(($2 => Parser$text(text$1))));
    var Fm$Term$all = (eras$1 => (self$2 => (name$3 => (xtyp$4 => (body$5 => ({
        _: 'Fm.Term.all',
        'eras': eras$1,
        'self': self$2,
        'name': name$3,
        'xtyp': xtyp$4,
        'body': body$5
    }))))));
    var Fm$Parser$forall = Monad$bind(Parser$monad)(Fm$Parser$spaces)(($1 => Monad$bind(Parser$monad)(Fm$Parser$name)((self$2 => Monad$bind(Parser$monad)(Fm$Parser$binder)((bind$3 => Monad$bind(Parser$monad)(Parser$maybe(Parser$spaces_text("->")))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$5 => (() => {
        var term$6 = List$fold(bind$3)(body$5)((x$6 => (t$7 => (() => {
            var self = x$6;
            switch (self._) {
                case 'Fm.Binder.new':
                    var $55 = self.eras;
                    var $56 = self.name;
                    var $57 = self.term;
                    return Fm$Term$all($55)("")($56)($57)((s$11 => (x$12 => t$7)));
            }
        })())));
        return Monad$pure(Parser$monad)((() => {
            var self = term$6;
            switch (self._) {
                case 'Fm.Term.var':
                    var $58 = self.name;
                    var $59 = self.indx;
                    return term$6;
                case 'Fm.Term.ref':
                    var $60 = self.name;
                    return term$6;
                case 'Fm.Term.typ':
                    return term$6;
                case 'Fm.Term.all':
                    var $61 = self.eras;
                    var $62 = self.self;
                    var $63 = self.name;
                    var $64 = self.xtyp;
                    var $65 = self.body;
                    return Fm$Term$all($61)(self$2)($63)($64)($65);
                case 'Fm.Term.lam':
                    var $66 = self.name;
                    var $67 = self.body;
                    return term$6;
                case 'Fm.Term.app':
                    var $68 = self.func;
                    var $69 = self.argm;
                    return term$6;
                case 'Fm.Term.let':
                    var $70 = self.name;
                    var $71 = self.expr;
                    var $72 = self.body;
                    return term$6;
                case 'Fm.Term.def':
                    var $73 = self.name;
                    var $74 = self.expr;
                    var $75 = self.body;
                    return term$6;
                case 'Fm.Term.ann':
                    var $76 = self.done;
                    var $77 = self.term;
                    var $78 = self.type;
                    return term$6;
                case 'Fm.Term.gol':
                    var $79 = self.name;
                    var $80 = self.dref;
                    var $81 = self.verb;
                    return term$6;
                case 'Fm.Term.hol':
                    var $82 = self.path;
                    return term$6;
                case 'Fm.Term.nat':
                    var $83 = self.natx;
                    return term$6;
                case 'Fm.Term.chr':
                    var $84 = self.chrx;
                    return term$6;
                case 'Fm.Term.str':
                    var $85 = self.strx;
                    return term$6;
                case 'Fm.Term.sug':
                    var $86 = self.sugx;
                    return term$6;
            }
        })())
    })()))))))))));
    var Fm$Parser$name1 = Monad$bind(Parser$monad)(Parser$many1(Fm$Parser$letter))((chrs$1 => Monad$pure(Parser$monad)(List$fold(chrs$1)(String$nil)(String$cons))));
    var Fm$Term$lam = (name$1 => (body$2 => ({
        _: 'Fm.Term.lam',
        'name': name$1,
        'body': body$2
    })));
    var Fm$Parser$make_lambda = (names$1 => (body$2 => (() => {
        var self = names$1;
        switch (self._) {
            case 'List.nil':
                return body$2;
            case 'List.cons':
                var $87 = self.head;
                var $88 = self.tail;
                return Fm$Term$lam($87)((x$5 => Fm$Parser$make_lambda($88)(body$2)));
        }
    })()));
    var Fm$Parser$lambda = Monad$bind(Parser$monad)(Parser$first_of(List$cons(Parser$spaces_text("("))(List$cons(Parser$spaces_text("<"))(List$nil))))(($1 => Monad$bind(Parser$monad)(Parser$many1(Fm$Parser$item(Fm$Parser$name1)))((name$2 => Monad$bind(Parser$monad)(Parser$first_of(List$cons(Parser$text(")"))(List$cons(Parser$text(">"))(List$nil))))(($3 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$4 => Monad$pure(Parser$monad)(Fm$Parser$make_lambda(name$2)(body$4))))))))));
    var Fm$Parser$parenthesis = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("("))(($1 => Monad$bind(Parser$monad)(Fm$Parser$term)((term$2 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(")"))(($3 => Monad$pure(Parser$monad)(term$2)))))));
    var Fm$Term$ref = (name$1 => ({
        _: 'Fm.Term.ref',
        'name': name$1
    }));
    var Fm$Term$app = (func$1 => (argm$2 => ({
        _: 'Fm.Term.app',
        'func': func$1,
        'argm': argm$2
    })));
    var Fm$Term$hol = (path$1 => ({
        _: 'Fm.Term.hol',
        'path': path$1
    }));
    var Bits$nil = '';
    var Fm$Term$let = (name$1 => (expr$2 => (body$3 => ({
        _: 'Fm.Term.let',
        'name': name$1,
        'expr': expr$2,
        'body': body$3
    }))));
    var Fm$Parser$letforin = Monad$bind(Parser$monad)(Parser$spaces_text("let "))(($1 => Monad$bind(Parser$monad)(Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$3 => Monad$bind(Parser$monad)(Parser$spaces_text("="))(($4 => Monad$bind(Parser$monad)(Parser$spaces_text("for "))(($5 => Monad$bind(Parser$monad)(Parser$spaces)(($6 => Monad$bind(Parser$monad)(Fm$Parser$name1)((elem$7 => Monad$bind(Parser$monad)(Parser$spaces_text("in"))(($8 => Monad$bind(Parser$monad)(Fm$Parser$term)((list$9 => Monad$bind(Parser$monad)(Parser$spaces_text(":"))(($10 => Monad$bind(Parser$monad)(Fm$Parser$term)((loop$11 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($12 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$13 => (() => {
        var term$14 = Fm$Term$ref("List.for");
        var term$15 = Fm$Term$app(term$14)(Fm$Term$hol(Bits$nil));
        var term$16 = Fm$Term$app(term$15)(list$9);
        var term$17 = Fm$Term$app(term$16)(Fm$Term$hol(Bits$nil));
        var term$18 = Fm$Term$app(term$17)(Fm$Term$ref(name$3));
        var lamb$19 = Fm$Term$lam(elem$7)((i$19 => Fm$Term$lam(name$3)((x$20 => loop$11))));
        var term$20 = Fm$Term$app(term$18)(lamb$19);
        var term$21 = Fm$Term$let(name$3)(term$20)((x$21 => body$13));
        return Monad$pure(Parser$monad)(term$21)
    })()))))))))))))))))))))))))));
    var Fm$Parser$let = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("let "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("="))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$5 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(";"))(($6 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$7 => Monad$pure(Parser$monad)(Fm$Term$let(name$3)(expr$5)((x$8 => body$7)))))))))))))))));
    var Fm$Term$def = (name$1 => (expr$2 => (body$3 => ({
        _: 'Fm.Term.def',
        'name': name$1,
        'expr': expr$2,
        'body': body$3
    }))));
    var Fm$Parser$def = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("def "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("="))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$5 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(";"))(($6 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$7 => Monad$pure(Parser$monad)(Fm$Term$def(name$3)(expr$5)((x$8 => body$7)))))))))))))))));
    var Fm$Parser$if = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("if "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$term)((cond$2 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("then"))(($3 => Monad$bind(Parser$monad)(Fm$Parser$term)((tcse$4 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("else"))(($5 => Monad$bind(Parser$monad)(Fm$Parser$term)((fcse$6 => (() => {
        var term$7 = cond$2;
        var term$8 = Fm$Term$app(term$7)(Fm$Term$lam("")((x$8 => Fm$Term$hol(Bits$nil))));
        var term$9 = Fm$Term$app(term$8)(tcse$4);
        var term$10 = Fm$Term$app(term$9)(fcse$6);
        return Monad$pure(Parser$monad)(term$10)
    })()))))))))))));
    var Pair$new = (fst$3 => (snd$4 => ({
        _: 'Pair.new',
        'fst': fst$3,
        'snd': snd$4
    })));
    var List$mapped = (as$2 => (f$4 => (() => {
        var self = as$2;
        switch (self._) {
            case 'List.nil':
                return List$nil;
            case 'List.cons':
                var $89 = self.head;
                var $90 = self.tail;
                return List$cons(f$4($89))(List$mapped($90)(f$4));
        }
    })()));
    var Parser$one = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("Unexpected end of file.");
            case 'cons':
                var $91 = self.charCodeAt(0);
                var $92 = self.slice(1);
                return Parser$Reply$value($92)($91);
        }
    })());
    var Fm$Parser$char$single = (() => {
        var escs$1 = List$cons(Pair$new("\\b")(8))(List$cons(Pair$new("\\f")(12))(List$cons(Pair$new("\\n")(10))(List$cons(Pair$new("\\r")(13))(List$cons(Pair$new("\\t")(9))(List$cons(Pair$new("\\v")(11))(List$cons(Pair$new("\\\"")(34))(List$cons(Pair$new("\\0")(0))(List$cons(Pair$new("\\\'")(39))(List$nil)))))))));
        return Parser$first_of(List$cons(Parser$first_of(List$mapped(escs$1)((esc$2 => (() => {
            var self = esc$2;
            switch (self._) {
                case 'Pair.new':
                    var $93 = self.fst;
                    var $94 = self.snd;
                    return Monad$bind(Parser$monad)(Parser$text($93))(($5 => Monad$pure(Parser$monad)($94)));
            }
        })()))))(List$cons(Parser$one)(List$nil)))
    })();
    var Fm$Term$chr = (chrx$1 => ({
        _: 'Fm.Term.chr',
        'chrx': chrx$1
    }));
    var Fm$Parser$char = Monad$bind(Parser$monad)(Parser$spaces_text("\'"))(($1 => Monad$bind(Parser$monad)(Fm$Parser$char$single)((chrx$2 => Monad$bind(Parser$monad)(Parser$text("\'"))(($3 => Monad$pure(Parser$monad)(Fm$Term$chr(chrx$2))))))));
    var Parser$if_not = (a$2 => (b$3 => (code$4 => (() => {
        var self = a$2(code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $95 = self.code;
                var $96 = self.err;
                return b$3(code$4);
            case 'Parser.Reply.value':
                var $97 = self.code;
                var $98 = self.val;
                return Parser$Reply$error(code$4)("Prevented.");
        }
    })())));
    var Parser$until = (cond$2 => (parser$3 => Parser$many(Parser$if_not(cond$2)(parser$3))));
    var Fm$Term$str = (strx$1 => ({
        _: 'Fm.Term.str',
        'strx': strx$1
    }));
    var Fm$Parser$string = (() => {
        var quot$1 = String$cons(34)(String$nil);
        return Monad$bind(Parser$monad)(Parser$spaces_text(quot$1))(($2 => Monad$bind(Parser$monad)(Parser$until(Parser$text(quot$1))(Fm$Parser$char$single))((chrs$3 => Monad$bind(Parser$monad)(Parser$text(quot$1))(($4 => (() => {
            var strx$5 = List$fold(chrs$3)(String$nil)(String$cons);
            return Monad$pure(Parser$monad)(Fm$Term$str(strx$5))
        })()))))))
    })();
    var Fm$Parser$pair = Monad$bind(Parser$monad)(Parser$spaces_text("{"))(($1 => Monad$bind(Parser$monad)(Fm$Parser$term)((val0$2 => Monad$bind(Parser$monad)(Parser$spaces_text(","))(($3 => Monad$bind(Parser$monad)(Fm$Parser$term)((val1$4 => Monad$bind(Parser$monad)(Parser$spaces_text("}"))(($5 => (() => {
        var term$6 = Fm$Term$ref("Pair.new");
        var term$7 = Fm$Term$app(term$6)(Fm$Term$hol(Bits$nil));
        var term$8 = Fm$Term$app(term$7)(Fm$Term$hol(Bits$nil));
        var term$9 = Fm$Term$app(term$8)(val0$2);
        var term$10 = Fm$Term$app(term$9)(val1$4);
        return Monad$pure(Parser$monad)(term$10)
    })()))))))))));
    var Fm$Name$read = (str$1 => str$1);
    var Fm$Parser$list = Monad$bind(Parser$monad)(Parser$spaces_text("["))(($1 => Monad$bind(Parser$monad)(Parser$many(Fm$Parser$item(Fm$Parser$term)))((vals$2 => Monad$bind(Parser$monad)(Parser$spaces_text("]"))(($3 => Monad$pure(Parser$monad)(List$fold(vals$2)(Fm$Term$app(Fm$Term$ref(Fm$Name$read("List.nil")))(Fm$Term$hol(Bits$nil)))((x$4 => (xs$5 => (() => {
        var term$6 = Fm$Term$ref(Fm$Name$read("List.cons"));
        var term$7 = Fm$Term$app(term$6)(Fm$Term$hol(Bits$nil));
        var term$8 = Fm$Term$app(term$7)(x$4);
        var term$9 = Fm$Term$app(term$8)(xs$5);
        return term$9
    })()))))))))));
    var Fm$Parser$forin = Monad$bind(Parser$monad)(Parser$spaces_text("for "))(($1 => Monad$bind(Parser$monad)(Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name1)((elem$3 => Monad$bind(Parser$monad)(Parser$spaces_text("in"))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((list$5 => Monad$bind(Parser$monad)(Parser$spaces_text("with"))(($6 => Monad$bind(Parser$monad)(Parser$spaces)(($7 => Monad$bind(Parser$monad)(Parser$spaces)(($8 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$9 => Monad$bind(Parser$monad)(Parser$spaces_text(":"))(($10 => Monad$bind(Parser$monad)(Fm$Parser$term)((loop$11 => (() => {
        var term$12 = Fm$Term$ref("List.for");
        var term$13 = Fm$Term$app(term$12)(Fm$Term$hol(Bits$nil));
        var term$14 = Fm$Term$app(term$13)(list$5);
        var term$15 = Fm$Term$app(term$14)(Fm$Term$hol(Bits$nil));
        var term$16 = Fm$Term$app(term$15)(Fm$Term$ref(name$9));
        var lamb$17 = Fm$Term$lam(elem$3)((i$17 => Fm$Term$lam(name$9)((x$18 => loop$11))));
        var term$18 = Fm$Term$app(term$16)(lamb$17);
        var term$19 = Fm$Term$let(name$9)(term$18)((x$19 => Fm$Term$ref(name$9)));
        return Monad$pure(Parser$monad)(term$19)
    })()))))))))))))))))))))));
    var Fm$Parser$do$statements = (monad_name$1 => Parser$first_of(List$cons(Monad$bind(Parser$monad)(Parser$spaces_text("var "))(($2 => Monad$bind(Parser$monad)(Parser$spaces)(($3 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$4 => Monad$bind(Parser$monad)(Parser$spaces_text("="))(($5 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$6 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($7 => Monad$bind(Parser$monad)(Fm$Parser$do$statements(monad_name$1))((body$8 => (() => {
        var term$9 = Fm$Term$app(Fm$Term$ref("Monad.bind"))(Fm$Term$ref(monad_name$1));
        var term$10 = Fm$Term$app(term$9)(Fm$Term$ref((monad_name$1 + ".monad")));
        var term$11 = Fm$Term$app(term$10)(Fm$Term$hol(Bits$nil));
        var term$12 = Fm$Term$app(term$11)(Fm$Term$hol(Bits$nil));
        var term$13 = Fm$Term$app(term$12)(expr$6);
        var term$14 = Fm$Term$app(term$13)(Fm$Term$lam(name$4)((x$14 => body$8)));
        return Monad$pure(Parser$monad)(term$14)
    })())))))))))))))))(List$cons(Monad$bind(Parser$monad)(Parser$spaces_text("let "))(($2 => Monad$bind(Parser$monad)(Parser$spaces)(($3 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$4 => Monad$bind(Parser$monad)(Parser$spaces_text("="))(($5 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$6 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($7 => Monad$bind(Parser$monad)(Fm$Parser$do$statements(monad_name$1))((body$8 => Monad$pure(Parser$monad)(Fm$Term$let(name$4)(expr$6)((x$9 => body$8))))))))))))))))))(List$cons(Monad$bind(Parser$monad)(Parser$spaces_text("return "))(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$3 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($4 => (() => {
        var term$5 = Fm$Term$app(Fm$Term$ref("Monad.pure"))(Fm$Term$ref(monad_name$1));
        var term$6 = Fm$Term$app(term$5)(Fm$Term$ref((monad_name$1 + ".monad")));
        var term$7 = Fm$Term$app(term$6)(Fm$Term$hol(Bits$nil));
        var term$8 = Fm$Term$app(term$7)(expr$3);
        return Monad$pure(Parser$monad)(term$8)
    })())))))))(List$cons(Monad$bind(Parser$monad)(Fm$Parser$term)((expr$2 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($3 => Monad$bind(Parser$monad)(Fm$Parser$do$statements(monad_name$1))((body$4 => (() => {
        var term$5 = Fm$Term$app(Fm$Term$ref("Monad.bind"))(Fm$Term$ref(monad_name$1));
        var term$6 = Fm$Term$app(term$5)(Fm$Term$ref((monad_name$1 + ".monad")));
        var term$7 = Fm$Term$app(term$6)(Fm$Term$hol(Bits$nil));
        var term$8 = Fm$Term$app(term$7)(Fm$Term$hol(Bits$nil));
        var term$9 = Fm$Term$app(term$8)(expr$2);
        var term$10 = Fm$Term$app(term$9)(Fm$Term$lam("")((x$10 => body$4)));
        return Monad$pure(Parser$monad)(term$10)
    })())))))))(List$cons(Monad$bind(Parser$monad)(Fm$Parser$term)((expr$2 => Monad$bind(Parser$monad)(Parser$spaces_text(";"))(($3 => Monad$pure(Parser$monad)(expr$2))))))(List$nil)))))));
    var Fm$Parser$do = Monad$bind(Parser$monad)(Parser$spaces_text("do "))(($1 => Monad$bind(Parser$monad)(Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$3 => Monad$bind(Parser$monad)(Parser$spaces_text("{"))(($4 => Monad$bind(Parser$monad)(Fm$Parser$do$statements(name$3))((term$5 => Monad$bind(Parser$monad)(Parser$spaces_text("}"))(($6 => Monad$pure(Parser$monad)(term$5)))))))))))));
    var Fm$Def$new = (name$1 => (term$2 => (type$3 => (done$4 => ({
        _: 'Fm.Def.new',
        'name': name$1,
        'term': term$2,
        'type': type$3,
        'done': done$4
    })))));
    var Fm$Parser$case$with = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("with"))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(":"))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((type$5 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("="))(($6 => Monad$bind(Parser$monad)(Fm$Parser$term)((term$7 => Monad$pure(Parser$monad)(Fm$Def$new(name$3)(term$7)(type$5)(Bool$false))))))))))))))));
    var Fm$Parser$case$case = Monad$bind(Parser$monad)(Fm$Parser$spaces)(($1 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$2 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(":"))(($3 => Monad$bind(Parser$monad)(Fm$Parser$term)((term$4 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$spaces_text(",")))(($5 => Monad$pure(Parser$monad)(Pair$new(name$2)(term$4))))))))))));
    var Map$tie = (val$2 => (lft$3 => (rgt$4 => ({
        _: 'Map.tie',
        'val': val$2,
        'lft': lft$3,
        'rgt': rgt$4
    }))));
    var Map$set = (bits$2 => (val$3 => (map$4 => (() => {
        var self = bits$2;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$some(val$3))(Map$new)(Map$new);
                        case 'Map.tie':
                            var $99 = self.val;
                            var $100 = self.lft;
                            var $101 = self.rgt;
                            return Map$tie(Maybe$some(val$3))($100)($101);
                    }
                })();
            case '0':
                var $102 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$set($102)(val$3)(Map$new))(Map$new);
                        case 'Map.tie':
                            var $103 = self.val;
                            var $104 = self.lft;
                            var $105 = self.rgt;
                            return Map$tie($103)(Map$set($102)(val$3)($104))($105);
                    }
                })();
            case '1':
                var $106 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$new)(Map$set($106)(val$3)(Map$new));
                        case 'Map.tie':
                            var $107 = self.val;
                            var $108 = self.lft;
                            var $109 = self.rgt;
                            return Map$tie($107)($108)(Map$set($106)(val$3)($109));
                    }
                })();
        }
    })())));
    var Map$from_list = (f$3 => (xs$4 => (() => {
        var self = xs$4;
        switch (self._) {
            case 'List.nil':
                return Map$new;
            case 'List.cons':
                var $110 = self.head;
                var $111 = self.tail;
                return (() => {
                    var self = $110;
                    switch (self._) {
                        case 'Pair.new':
                            var $112 = self.fst;
                            var $113 = self.snd;
                            return Map$set(f$3($112))($113)(Map$from_list(f$3)($111));
                    }
                })();
        }
    })()));
    var U16$new = (value$1 => word_to_u16(value$1));
    var Word$nil = ({
        _: 'Word.nil'
    });
    var Word = (size$1 => null);
    var Nat$succ = (pred$1 => 1n + pred$1);
    var Word$1 = (pred$2 => ({
        _: 'Word.1',
        'pred': pred$2
    }));
    var Word$0 = (pred$2 => ({
        _: 'Word.0',
        'pred': pred$2
    }));
    var Word$subber = (a$2 => (b$3 => (c$4 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Word.nil':
                return (b$5 => Word$nil);
            case 'Word.0':
                var $114 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $115 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$subber(a$pred$10)($115)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($115)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $116 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$subber(a$pred$10)($116)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($116)(Bool$true));
                                }
                            })());
                    }
                })()($114));
            case 'Word.1':
                var $117 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $118 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$subber(a$pred$10)($118)(Bool$false));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($118)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $119 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$subber(a$pred$10)($119)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($119)(Bool$false));
                                }
                            })());
                    }
                })()($117));
        }
    })()(b$3))));
    var Word$sub = (a$2 => (b$3 => Word$subber(a$2)(b$3)(Bool$false)));
    var U16$sub = a0 => a1 => (Math.max(a0 - a1, 0));
    var Nat$apply = n$2 => f$3 => x$4 => {
        var Nat$apply = n$2 => f$3 => x$4 => ({
            ctr: 'TCO',
            arg: [n$2, f$3, x$4]
        });
        var arg = [n$2, f$3, x$4];
        while (true) {
            let [n$2, f$3, x$4] = arg;
            var R = (() => {
                var self = n$2;
                switch (self === 0n ? 'zero' : 'succ') {
                    case 'zero':
                        return x$4;
                    case 'succ':
                        var $120 = (self - 1n);
                        return Nat$apply($120)(f$3)(f$3(x$4));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Word$inc = (word$2 => (() => {
        var self = word$2;
        switch (self._) {
            case 'Word.nil':
                return Word$nil;
            case 'Word.0':
                var $121 = self.pred;
                return Word$1($121);
            case 'Word.1':
                var $122 = self.pred;
                return Word$0(Word$inc($122));
        }
    })());
    var U16$inc = (a$1 => (() => {
        var self = a$1;
        switch ('u16') {
            case 'u16':
                var $123 = u16_to_word(self);
                return U16$new(Word$inc($123));
        }
    })());
    var Word$zero = (size$1 => (() => {
        var self = size$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $124 = (self - 1n);
                return Word$0(Word$zero($124));
        }
    })());
    var U16$zero = U16$new(Word$zero(16n));
    var Nat$to_u16 = a0 => (Number(a0));
    var Word$adder = (a$2 => (b$3 => (c$4 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Word.nil':
                return (b$5 => Word$nil);
            case 'Word.0':
                var $125 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $126 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($126)(Bool$false));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($126)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $127 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($127)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($127)(Bool$false));
                                }
                            })());
                    }
                })()($125));
            case 'Word.1':
                var $128 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $129 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($129)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($129)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $130 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($130)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($130)(Bool$true));
                                }
                            })());
                    }
                })()($128));
        }
    })()(b$3))));
    var Word$add = (a$2 => (b$3 => Word$adder(a$2)(b$3)(Bool$false)));
    var U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);
    var Bits$0 = (pred$1 => pred$1 + '0');
    var Bits$1 = (pred$1 => pred$1 + '1');
    var Word$to_bits = (a$2 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Word.nil':
                return Bits$nil;
            case 'Word.0':
                var $131 = self.pred;
                return Bits$0(Word$to_bits($131));
            case 'Word.1':
                var $132 = self.pred;
                return Bits$1(Word$to_bits($132));
        }
    })());
    var Nat$zero = 0n;
    var Word$trim = (new_size$2 => (word$3 => (() => {
        var self = new_size$2;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $133 = (self - 1n);
                return (() => {
                    var self = word$3;
                    switch (self._) {
                        case 'Word.nil':
                            return Word$0(Word$trim($133)(Word$nil));
                        case 'Word.0':
                            var $134 = self.pred;
                            return Word$0(Word$trim($133)($134));
                        case 'Word.1':
                            var $135 = self.pred;
                            return Word$1(Word$trim($133)($135));
                    }
                })();
        }
    })()));
    var Bits$concat = a0 => a1 => (a1 + a0);
    var Bits$reverse$tco = a$1 => r$2 => {
        var Bits$reverse$tco = a$1 => r$2 => ({
            ctr: 'TCO',
            arg: [a$1, r$2]
        });
        var arg = [a$1, r$2];
        while (true) {
            let [a$1, r$2] = arg;
            var R = (() => {
                var self = a$1;
                switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                    case 'nil':
                        return r$2;
                    case '0':
                        var $136 = self.slice(0, -1);
                        return Bits$reverse$tco($136)(Bits$0(r$2));
                    case '1':
                        var $137 = self.slice(0, -1);
                        return Bits$reverse$tco($137)(Bits$1(r$2));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Bits$reverse = (a$1 => Bits$reverse$tco(a$1)(Bits$nil));
    var Fm$Name$to_bits = a0 => (fm_name_to_bits(a0));
    var Fm$Sugar$cse = (expr$1 => (name$2 => (with$3 => (cses$4 => (moti$5 => ({
        _: 'Fm.Sugar.cse',
        'expr': expr$1,
        'name': name$2,
        'with': with$3,
        'cses': cses$4,
        'moti': moti$5
    }))))));
    var Fm$Term$sug = (sugx$1 => ({
        _: 'Fm.Term.sug',
        'sugx': sugx$1
    }));
    var Fm$Parser$case = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("case "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$3 => Monad$bind(Parser$monad)(Parser$maybe(Monad$bind(Parser$monad)(Fm$Parser$spaces_text("as"))(($4 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($5 => Fm$Parser$name1))))))((name$4 => (() => {
        var name$5 = (() => {
            var self = name$4;
            switch (self._) {
                case 'Maybe.none':
                    return (() => {
                        var self = expr$3;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $138 = self.name;
                                var $139 = self.indx;
                                return $138;
                            case 'Fm.Term.ref':
                                var $140 = self.name;
                                return $140;
                            case 'Fm.Term.typ':
                                return Fm$Name$read("self");
                            case 'Fm.Term.all':
                                var $141 = self.eras;
                                var $142 = self.self;
                                var $143 = self.name;
                                var $144 = self.xtyp;
                                var $145 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.lam':
                                var $146 = self.name;
                                var $147 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.app':
                                var $148 = self.func;
                                var $149 = self.argm;
                                return Fm$Name$read("self");
                            case 'Fm.Term.let':
                                var $150 = self.name;
                                var $151 = self.expr;
                                var $152 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.def':
                                var $153 = self.name;
                                var $154 = self.expr;
                                var $155 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.ann':
                                var $156 = self.done;
                                var $157 = self.term;
                                var $158 = self.type;
                                return Fm$Name$read("self");
                            case 'Fm.Term.gol':
                                var $159 = self.name;
                                var $160 = self.dref;
                                var $161 = self.verb;
                                return Fm$Name$read("self");
                            case 'Fm.Term.hol':
                                var $162 = self.path;
                                return Fm$Name$read("self");
                            case 'Fm.Term.nat':
                                var $163 = self.natx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.chr':
                                var $164 = self.chrx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.str':
                                var $165 = self.strx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.sug':
                                var $166 = self.sugx;
                                return Fm$Name$read("self");
                        }
                    })();
                case 'Maybe.some':
                    var $167 = self.value;
                    return $167;
            }
        })();
        return Monad$bind(Parser$monad)(Parser$many(Fm$Parser$case$with))((with$6 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("{"))(($7 => Monad$bind(Parser$monad)(Parser$many(Fm$Parser$case$case))((cses$8 => (() => {
            var cses$9 = Map$from_list(Fm$Name$to_bits)(cses$8);
            return Monad$bind(Parser$monad)(Fm$Parser$spaces_text("}"))(($10 => Monad$bind(Parser$monad)(Parser$maybe(Monad$bind(Parser$monad)(Fm$Parser$spaces_text(":"))(($11 => Fm$Parser$term))))((moti$11 => (() => {
                var moti$12 = (() => {
                    var self = moti$11;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$hol(Bits$nil);
                        case 'Maybe.some':
                            var $168 = self.value;
                            return $168;
                    }
                })();
                var sugr$13 = Fm$Sugar$cse(expr$3)(name$5)(with$6)(cses$9)(moti$12);
                var term$14 = Fm$Term$sug(sugr$13);
                return Monad$pure(Parser$monad)(term$14)
            })()))))
        })()))))))
    })()))))))));
    var Parser$digit = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("No parse.");
            case 'cons':
                var $169 = self.charCodeAt(0);
                var $170 = self.slice(1);
                return (() => {
                    var self = ($169 === 48);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($170)(0n);
                        case 'false':
                            return (() => {
                                var self = ($169 === 49);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$Reply$value($170)(1n);
                                    case 'false':
                                        return (() => {
                                            var self = ($169 === 50);
                                            switch (self ? 'true' : 'false') {
                                                case 'true':
                                                    return Parser$Reply$value($170)(2n);
                                                case 'false':
                                                    return (() => {
                                                        var self = ($169 === 51);
                                                        switch (self ? 'true' : 'false') {
                                                            case 'true':
                                                                return Parser$Reply$value($170)(3n);
                                                            case 'false':
                                                                return (() => {
                                                                    var self = ($169 === 52);
                                                                    switch (self ? 'true' : 'false') {
                                                                        case 'true':
                                                                            return Parser$Reply$value($170)(4n);
                                                                        case 'false':
                                                                            return (() => {
                                                                                var self = ($169 === 53);
                                                                                switch (self ? 'true' : 'false') {
                                                                                    case 'true':
                                                                                        return Parser$Reply$value($170)(5n);
                                                                                    case 'false':
                                                                                        return (() => {
                                                                                            var self = ($169 === 54);
                                                                                            switch (self ? 'true' : 'false') {
                                                                                                case 'true':
                                                                                                    return Parser$Reply$value($170)(6n);
                                                                                                case 'false':
                                                                                                    return (() => {
                                                                                                        var self = ($169 === 55);
                                                                                                        switch (self ? 'true' : 'false') {
                                                                                                            case 'true':
                                                                                                                return Parser$Reply$value($170)(7n);
                                                                                                            case 'false':
                                                                                                                return (() => {
                                                                                                                    var self = ($169 === 56);
                                                                                                                    switch (self ? 'true' : 'false') {
                                                                                                                        case 'true':
                                                                                                                            return Parser$Reply$value($170)(8n);
                                                                                                                        case 'false':
                                                                                                                            return (() => {
                                                                                                                                var self = ($169 === 57);
                                                                                                                                switch (self ? 'true' : 'false') {
                                                                                                                                    case 'true':
                                                                                                                                        return Parser$Reply$value($170)(9n);
                                                                                                                                    case 'false':
                                                                                                                                        return Parser$Reply$error(code$1)("No parse.");
                                                                                                                                }
                                                                                                                            })();
                                                                                                                    }
                                                                                                                })();
                                                                                                        }
                                                                                                    })();
                                                                                            }
                                                                                        })();
                                                                                }
                                                                            })();
                                                                    }
                                                                })();
                                                        }
                                                    })();
                                            }
                                        })();
                                }
                            })();
                    }
                })();
        }
    })());
    var Nat$add = a0 => a1 => (a0 + a1);
    var Nat$mul = a0 => a1 => (a0 * a1);
    var Nat$from_base$go = b$1 => ds$2 => p$3 => res$4 => {
        var Nat$from_base$go = b$1 => ds$2 => p$3 => res$4 => ({
            ctr: 'TCO',
            arg: [b$1, ds$2, p$3, res$4]
        });
        var arg = [b$1, ds$2, p$3, res$4];
        while (true) {
            let [b$1, ds$2, p$3, res$4] = arg;
            var R = (() => {
                var self = ds$2;
                switch (self._) {
                    case 'List.nil':
                        return res$4;
                    case 'List.cons':
                        var $171 = self.head;
                        var $172 = self.tail;
                        return Nat$from_base$go(b$1)($172)((b$1 * p$3))((($171 * p$3) + res$4));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$reverse$go = xs$2 => res$3 => {
        var List$reverse$go = xs$2 => res$3 => ({
            ctr: 'TCO',
            arg: [xs$2, res$3]
        });
        var arg = [xs$2, res$3];
        while (true) {
            let [xs$2, res$3] = arg;
            var R = (() => {
                var self = xs$2;
                switch (self._) {
                    case 'List.nil':
                        return res$3;
                    case 'List.cons':
                        var $173 = self.head;
                        var $174 = self.tail;
                        return List$reverse$go($174)(List$cons($173)(res$3));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$reverse = (xs$2 => List$reverse$go(xs$2)(List$nil));
    var Nat$from_base = (base$1 => (ds$2 => Nat$from_base$go(base$1)(List$reverse(ds$2))(1n)(0n)));
    var Parser$nat = Monad$bind(Parser$monad)(Parser$many1(Parser$digit))((digits$1 => Monad$pure(Parser$monad)(Nat$from_base(10n)(digits$1))));
    var Bits$tail = (a$1 => (() => {
        var self = a$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return Bits$nil;
            case '0':
                var $175 = self.slice(0, -1);
                return $175;
            case '1':
                var $176 = self.slice(0, -1);
                return $176;
        }
    })());
    var Bits$inc = (a$1 => (() => {
        var self = a$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return Bits$1(Bits$nil);
            case '0':
                var $177 = self.slice(0, -1);
                return Bits$1($177);
            case '1':
                var $178 = self.slice(0, -1);
                return Bits$0(Bits$inc($178));
        }
    })());
    var Nat$to_bits = a0 => (nat_to_bits(a0));
    var Maybe$to_bool = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Maybe.none':
                return Bool$false;
            case 'Maybe.some':
                var $179 = self.value;
                return Bool$true;
        }
    })());
    var Fm$Term$gol = (name$1 => (dref$2 => (verb$3 => ({
        _: 'Fm.Term.gol',
        'name': name$1,
        'dref': dref$2,
        'verb': verb$3
    }))));
    var Fm$Parser$goal = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("?"))(($1 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$2 => Monad$bind(Parser$monad)(Parser$many(Monad$bind(Parser$monad)(Fm$Parser$spaces_text("-"))(($3 => Monad$bind(Parser$monad)(Parser$nat)((nat$4 => (() => {
        var bits$5 = Bits$reverse(Bits$tail(Bits$reverse((nat_to_bits(nat$4)))));
        return Monad$pure(Parser$monad)(bits$5)
    })()))))))((dref$3 => Monad$bind(Parser$monad)(Monad$bind(Parser$monad)(Parser$maybe(Parser$text("-")))((verb$4 => Monad$pure(Parser$monad)(Maybe$to_bool(verb$4)))))((verb$4 => Monad$pure(Parser$monad)(Fm$Term$gol(name$2)(dref$3)(verb$4))))))))));
    var Fm$Parser$hole = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("_"))(($1 => Monad$pure(Parser$monad)(Fm$Term$hol(Bits$nil))));
    var Fm$Term$nat = (natx$1 => ({
        _: 'Fm.Term.nat',
        'natx': natx$1
    }));
    var Fm$Parser$nat = Monad$bind(Parser$monad)(Fm$Parser$spaces)(($1 => Monad$bind(Parser$monad)(Parser$nat)((natx$2 => Monad$pure(Parser$monad)(Fm$Term$nat(natx$2))))));
    var Fm$Parser$reference = Monad$bind(Parser$monad)(Fm$Parser$spaces)(($1 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$2 => Monad$pure(Parser$monad)(Fm$Term$ref(name$2))))));
    var Fm$Sugar$app = (func$1 => (args$2 => ({
        _: 'Fm.Sugar.app',
        'func': func$1,
        'args': args$2
    })));
    var Fm$Parser$sugar$application = (func$1 => Monad$bind(Parser$monad)(Parser$text("("))(($2 => Monad$bind(Parser$monad)(Parser$many1(Fm$Parser$item(Fm$Parser$name_term)))((args$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(")"))(($4 => (() => {
        var args$5 = Map$from_list(Fm$Name$to_bits)(args$3);
        var term$6 = Fm$Term$sug(Fm$Sugar$app(func$1)(args$5));
        return Monad$pure(Parser$monad)(term$6)
    })())))))));
    var List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
    var Fm$Parser$application = (func$1 => Monad$bind(Parser$monad)(Parser$first_of(List$cons(Parser$text("("))(List$cons(Parser$text("<"))(List$nil))))(($2 => Monad$bind(Parser$monad)(Parser$many1(Fm$Parser$item(Fm$Parser$term)))((args$3 => Monad$bind(Parser$monad)(Parser$first_of(List$cons(Parser$spaces_text(")"))(List$cons(Parser$spaces_text(">"))(List$nil))))(($4 => Monad$pure(Parser$monad)((list_for(args$3)(func$1)((x$5 => (f$6 => Fm$Term$app(f$6)(x$5)))))))))))));
    var Fm$Parser$arrow = (xtyp$1 => Monad$bind(Parser$monad)(Parser$spaces_text("->"))(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$3 => Monad$pure(Parser$monad)(Fm$Term$all(Bool$false)("")("")(xtyp$1)((s$4 => (x$5 => body$3)))))))));
    var Fm$Term$ann = (done$1 => (term$2 => (type$3 => ({
        _: 'Fm.Term.ann',
        'done': done$1,
        'term': term$2,
        'type': type$3
    }))));
    var Fm$Parser$annotation = (term$1 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("::"))(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((type$3 => Monad$pure(Parser$monad)(Fm$Term$ann(Bool$false)(term$1)(type$3)))))));
    var Fm$Parser$suffix = term$1 => code$2 => {
        var Fm$Parser$suffix = term$1 => code$2 => ({
            ctr: 'TCO',
            arg: [term$1, code$2]
        });
        var arg = [term$1, code$2];
        while (true) {
            let [term$1, code$2] = arg;
            var R = (() => {
                var suffix_parser$3 = Parser$first_of(List$cons(Fm$Parser$sugar$application(term$1))(List$cons(Fm$Parser$application(term$1))(List$cons(Fm$Parser$arrow(term$1))(List$cons(Fm$Parser$annotation(term$1))(List$nil)))));
                return (() => {
                    var self = suffix_parser$3(code$2);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $180 = self.code;
                            var $181 = self.err;
                            return Parser$Reply$value(code$2)(term$1);
                        case 'Parser.Reply.value':
                            var $182 = self.code;
                            var $183 = self.val;
                            return Fm$Parser$suffix($183)($182);
                    }
                })()
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Fm$Parser$term = Monad$bind(Parser$monad)(Parser$first_of(List$cons(Fm$Parser$type)(List$cons(Fm$Parser$forall)(List$cons(Fm$Parser$lambda)(List$cons(Fm$Parser$parenthesis)(List$cons(Fm$Parser$letforin)(List$cons(Fm$Parser$let)(List$cons(Fm$Parser$def)(List$cons(Fm$Parser$if)(List$cons(Fm$Parser$char)(List$cons(Fm$Parser$string)(List$cons(Fm$Parser$pair)(List$cons(Fm$Parser$list)(List$cons(Fm$Parser$forin)(List$cons(Fm$Parser$do)(List$cons(Fm$Parser$case)(List$cons(Fm$Parser$goal)(List$cons(Fm$Parser$hole)(List$cons(Fm$Parser$nat)(List$cons(Fm$Parser$reference)(List$nil)))))))))))))))))))))((term$1 => Fm$Parser$suffix(term$1)));
    var Fm$Parser$name_term = Monad$bind(Parser$monad)(Fm$Parser$name)((name$1 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text(":"))(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((type$3 => Monad$pure(Parser$monad)(Pair$new(name$1)(type$3))))))));
    var Fm$Binder$new = (eras$1 => (name$2 => (term$3 => ({
        _: 'Fm.Binder.new',
        'eras': eras$1,
        'name': name$2,
        'term': term$3
    }))));
    var Fm$Parser$binder$homo = (eras$1 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text((() => {
        var self = eras$1;
        switch (self ? 'true' : 'false') {
            case 'true':
                return "<";
            case 'false':
                return "(";
        }
    })()))(($2 => Monad$bind(Parser$monad)(Parser$many1(Fm$Parser$item(Fm$Parser$name_term)))((bind$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text((() => {
        var self = eras$1;
        switch (self ? 'true' : 'false') {
            case 'true':
                return ">";
            case 'false':
                return ")";
        }
    })()))(($4 => Monad$pure(Parser$monad)(List$mapped(bind$3)((pair$5 => (() => {
        var self = pair$5;
        switch (self._) {
            case 'Pair.new':
                var $184 = self.fst;
                var $185 = self.snd;
                return Fm$Binder$new(eras$1)($184)($185);
        }
    })()))))))))));
    var List$concat = (as$2 => (bs$3 => (() => {
        var self = as$2;
        switch (self._) {
            case 'List.nil':
                return bs$3;
            case 'List.cons':
                var $186 = self.head;
                var $187 = self.tail;
                return List$cons($186)(List$concat($187)(bs$3));
        }
    })()));
    var List$flatten = (xs$2 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'List.nil':
                return List$nil;
            case 'List.cons':
                var $188 = self.head;
                var $189 = self.tail;
                return List$concat($188)(List$flatten($189));
        }
    })());
    var Fm$Parser$binder = Monad$bind(Parser$monad)(Parser$many1(Parser$first_of(List$cons(Fm$Parser$binder$homo(Bool$true))(List$cons(Fm$Parser$binder$homo(Bool$false))(List$nil)))))((lists$1 => Monad$pure(Parser$monad)(List$flatten(lists$1))));
    var Fm$Parser$make_forall = (binds$1 => (body$2 => (() => {
        var self = binds$1;
        switch (self._) {
            case 'List.nil':
                return body$2;
            case 'List.cons':
                var $190 = self.head;
                var $191 = self.tail;
                return (() => {
                    var self = $190;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $192 = self.eras;
                            var $193 = self.name;
                            var $194 = self.term;
                            return Fm$Term$all($192)("")($193)($194)((s$8 => (x$9 => Fm$Parser$make_forall($191)(body$2))));
                    }
                })();
        }
    })()));
    var List$at = index$2 => list$3 => {
        var List$at = index$2 => list$3 => ({
            ctr: 'TCO',
            arg: [index$2, list$3]
        });
        var arg = [index$2, list$3];
        while (true) {
            let [index$2, list$3] = arg;
            var R = (() => {
                var self = list$3;
                switch (self._) {
                    case 'List.nil':
                        return Maybe$none;
                    case 'List.cons':
                        var $195 = self.head;
                        var $196 = self.tail;
                        return (() => {
                            var self = index$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Maybe$some($195);
                                case 'succ':
                                    var $197 = (self - 1n);
                                    return List$at($197)($196);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$at_last = (index$2 => (list$3 => List$at(index$2)(List$reverse(list$3))));
    var Fm$Term$var = (name$1 => (indx$2 => ({
        _: 'Fm.Term.var',
        'name': name$1,
        'indx': indx$2
    })));
    var Pair$snd = (pair$3 => (() => {
        var self = pair$3;
        switch (self._) {
            case 'Pair.new':
                var $198 = self.fst;
                var $199 = self.snd;
                return $199;
        }
    })());
    var String$eql = a0 => a1 => (a0 === a1);
    var Fm$Name$eql = (a$1 => (b$2 => (a$1 === b$2)));
    var Fm$Context$find = name$1 => ctx$2 => {
        var Fm$Context$find = name$1 => ctx$2 => ({
            ctr: 'TCO',
            arg: [name$1, ctx$2]
        });
        var arg = [name$1, ctx$2];
        while (true) {
            let [name$1, ctx$2] = arg;
            var R = (() => {
                var self = ctx$2;
                switch (self._) {
                    case 'List.nil':
                        return Maybe$none;
                    case 'List.cons':
                        var $200 = self.head;
                        var $201 = self.tail;
                        return (() => {
                            var self = $200;
                            switch (self._) {
                                case 'Pair.new':
                                    var $202 = self.fst;
                                    var $203 = self.snd;
                                    return (() => {
                                        var self = Fm$Name$eql(name$1)($202);
                                        switch (self ? 'true' : 'false') {
                                            case 'true':
                                                return Maybe$some($203);
                                            case 'false':
                                                return Fm$Context$find(name$1)($201);
                                        }
                                    })();
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$length$go = xs$2 => n$3 => {
        var List$length$go = xs$2 => n$3 => ({
            ctr: 'TCO',
            arg: [xs$2, n$3]
        });
        var arg = [xs$2, n$3];
        while (true) {
            let [xs$2, n$3] = arg;
            var R = (() => {
                var self = xs$2;
                switch (self._) {
                    case 'List.nil':
                        return n$3;
                    case 'List.cons':
                        var $204 = self.head;
                        var $205 = self.tail;
                        return List$length$go($205)(Nat$succ(n$3));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$length = (xs$2 => List$length$go(xs$2)(0n));
    var Fm$Path$0 = (path$1 => (x$2 => path$1(Bits$0(x$2))));
    var Fm$Path$1 = (path$1 => (x$2 => path$1(Bits$1(x$2))));
    var Fm$Path$to_bits = (path$1 => path$1(Bits$nil));
    var Fm$Term$bind = (vars$1 => (path$2 => (term$3 => (() => {
        var self = term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $206 = self.name;
                var $207 = self.indx;
                return (() => {
                    var self = List$at_last($207)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$var($206)($207);
                        case 'Maybe.some':
                            var $208 = self.value;
                            return Pair$snd($208);
                    }
                })();
            case 'Fm.Term.ref':
                var $209 = self.name;
                return (() => {
                    var self = Fm$Context$find($209)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($209);
                        case 'Maybe.some':
                            var $210 = self.value;
                            return $210;
                    }
                })();
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $211 = self.eras;
                var $212 = self.self;
                var $213 = self.name;
                var $214 = self.xtyp;
                var $215 = self.body;
                return (() => {
                    var vlen$9 = List$length(vars$1);
                    return Fm$Term$all($211)($212)($213)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($214))((s$10 => (x$11 => Fm$Term$bind(List$cons(Pair$new($213)(x$11))(List$cons(Pair$new($212)(s$10))(vars$1)))(Fm$Path$1(path$2))($215(Fm$Term$var($212)(vlen$9))(Fm$Term$var($213)(Nat$succ(vlen$9)))))))
                })();
            case 'Fm.Term.lam':
                var $216 = self.name;
                var $217 = self.body;
                return (() => {
                    var vlen$6 = List$length(vars$1);
                    return Fm$Term$lam($216)((x$7 => Fm$Term$bind(List$cons(Pair$new($216)(x$7))(vars$1))(Fm$Path$0(path$2))($217(Fm$Term$var($216)(vlen$6)))))
                })();
            case 'Fm.Term.app':
                var $218 = self.func;
                var $219 = self.argm;
                return Fm$Term$app(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($218))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($219));
            case 'Fm.Term.let':
                var $220 = self.name;
                var $221 = self.expr;
                var $222 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$let($220)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($221))((x$8 => Fm$Term$bind(List$cons(Pair$new($220)(x$8))(vars$1))(Fm$Path$1(path$2))($222(Fm$Term$var($220)(vlen$7)))))
                })();
            case 'Fm.Term.def':
                var $223 = self.name;
                var $224 = self.expr;
                var $225 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$def($223)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($224))((x$8 => Fm$Term$bind(List$cons(Pair$new($223)(x$8))(vars$1))(Fm$Path$1(path$2))($225(Fm$Term$var($223)(vlen$7)))))
                })();
            case 'Fm.Term.ann':
                var $226 = self.done;
                var $227 = self.term;
                var $228 = self.type;
                return Fm$Term$ann($226)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($227))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($228));
            case 'Fm.Term.gol':
                var $229 = self.name;
                var $230 = self.dref;
                var $231 = self.verb;
                return Fm$Term$gol($229)($230)($231);
            case 'Fm.Term.hol':
                var $232 = self.path;
                return Fm$Term$hol(Fm$Path$to_bits(path$2));
            case 'Fm.Term.nat':
                var $233 = self.natx;
                return Fm$Term$nat($233);
            case 'Fm.Term.chr':
                var $234 = self.chrx;
                return Fm$Term$chr($234);
            case 'Fm.Term.str':
                var $235 = self.strx;
                return Fm$Term$str($235);
            case 'Fm.Term.sug':
                var $236 = self.sugx;
                return (() => {
                    var self = $236;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $237 = self.func;
                            var $238 = self.args;
                            return (() => {
                                var func$7 = Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($237);
                                var args$8 = $238;
                                return Fm$Term$sug(Fm$Sugar$app(func$7)(args$8))
                            })();
                        case 'Fm.Sugar.cse':
                            var $239 = self.expr;
                            var $240 = self.name;
                            var $241 = self.with;
                            var $242 = self.cses;
                            var $243 = self.moti;
                            return (() => {
                                var expr$10 = Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($239);
                                var name$11 = $240;
                                var with$12 = $241;
                                var cses$13 = $242;
                                var moti$14 = $243;
                                return Fm$Term$sug(Fm$Sugar$cse(expr$10)(name$11)(with$12)(cses$13)(moti$14))
                            })();
                    }
                })();
        }
    })())));
    var Debug$log = a0 => a1 => ((console.log(a0), a1()));
    var Fm$Parser$definition = Monad$bind(Parser$monad)(Fm$Parser$spaces)(($1 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$2 => Monad$bind(Parser$monad)(Parser$many(Fm$Parser$binder))((args$3 => (() => {
        var args$4 = List$flatten(args$3);
        return Monad$bind(Parser$monad)(Fm$Parser$spaces_text(":"))(($5 => Monad$bind(Parser$monad)(Fm$Parser$term)((type$6 => Monad$bind(Parser$monad)(Fm$Parser$term)((term$7 => (() => {
            var type$8 = Fm$Parser$make_forall(args$4)(type$6);
            var term$9 = Fm$Parser$make_lambda(List$mapped(args$4)((x$9 => (() => {
                var self = x$9;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $244 = self.eras;
                        var $245 = self.name;
                        var $246 = self.term;
                        return $245;
                }
            })())))(term$7);
            var type$10 = Fm$Term$bind(List$nil)((x$10 => Bits$1(x$10)))(type$8);
            var term$11 = Fm$Term$bind(List$nil)((x$11 => Bits$0(x$11)))(term$9);
            return Monad$pure(Parser$monad)(((console.log(("parse " + name$2)), (x$12 => Fm$Def$new(name$2)(term$11)(type$10)(Bool$false))())))
        })()))))))
    })()))))));
    var Fm$Constructor$new = (name$1 => (args$2 => (inds$3 => ({
        _: 'Fm.Constructor.new',
        'name': name$1,
        'args': args$2,
        'inds': inds$3
    }))));
    var Fm$Parser$constructor = (namespace$1 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$2 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$binder))((args$3 => Monad$bind(Parser$monad)(Parser$maybe(Monad$bind(Parser$monad)(Fm$Parser$spaces_text("~"))(($4 => Fm$Parser$binder))))((inds$4 => (() => {
        var args$5 = Maybe$default(List$nil)(args$3);
        var inds$6 = Maybe$default(List$nil)(inds$4);
        return Monad$pure(Parser$monad)(Fm$Constructor$new(name$2)(args$5)(inds$6))
    })())))))));
    var Fm$Datatype$new = (name$1 => (pars$2 => (inds$3 => (ctrs$4 => ({
        _: 'Fm.Datatype.new',
        'name': name$1,
        'pars': pars$2,
        'inds': inds$3,
        'ctrs': ctrs$4
    })))));
    var Fm$Parser$datatype = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("type "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$name1)((name$2 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$binder))((pars$3 => Monad$bind(Parser$monad)(Parser$maybe(Monad$bind(Parser$monad)(Fm$Parser$spaces_text("~"))(($4 => Fm$Parser$binder))))((inds$4 => (() => {
        var pars$5 = Maybe$default(List$nil)(pars$3);
        var inds$6 = Maybe$default(List$nil)(inds$4);
        return Monad$bind(Parser$monad)(Fm$Parser$spaces_text("{"))(($7 => Monad$bind(Parser$monad)(Parser$many(Fm$Parser$item(Fm$Parser$constructor(name$2))))((ctrs$8 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("}"))(($9 => Monad$pure(Parser$monad)(Fm$Datatype$new(name$2)(pars$5)(inds$6)(ctrs$8))))))))
    })()))))))));
    var Fm$Datatype$build_term$motive$go = (type$1 => (name$2 => (inds$3 => (() => {
        var self = inds$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = type$1;
                    switch (self._) {
                        case 'Fm.Datatype.new':
                            var $247 = self.name;
                            var $248 = self.pars;
                            var $249 = self.inds;
                            var $250 = self.ctrs;
                            return (() => {
                                var slf$8 = Fm$Term$ref(name$2);
                                var slf$9 = (list_for($248)(slf$8)((var$9 => (slf$10 => Fm$Term$app(slf$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $251 = self.eras;
                                            var $252 = self.name;
                                            var $253 = self.term;
                                            return $252;
                                    }
                                })()))))));
                                var slf$10 = (list_for($249)(slf$9)((var$10 => (slf$11 => Fm$Term$app(slf$11)(Fm$Term$ref((() => {
                                    var self = var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $254 = self.eras;
                                            var $255 = self.name;
                                            var $256 = self.term;
                                            return $255;
                                    }
                                })()))))));
                                return Fm$Term$all(Bool$false)("")(Fm$Name$read("self"))(slf$10)((s$11 => (x$12 => Fm$Term$typ)))
                            })();
                    }
                })();
            case 'List.cons':
                var $257 = self.head;
                var $258 = self.tail;
                return (() => {
                    var self = $257;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $259 = self.eras;
                            var $260 = self.name;
                            var $261 = self.term;
                            return Fm$Term$all($259)("")($260)($261)((s$9 => (x$10 => Fm$Datatype$build_term$motive$go(type$1)(name$2)($258))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$motive = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $262 = self.name;
                var $263 = self.pars;
                var $264 = self.inds;
                var $265 = self.ctrs;
                return Fm$Datatype$build_term$motive$go(type$1)($262)($264);
        }
    })());
    var Fm$Datatype$build_term$constructor$go = (type$1 => (ctor$2 => (args$3 => (() => {
        var self = args$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = type$1;
                    switch (self._) {
                        case 'Fm.Datatype.new':
                            var $266 = self.name;
                            var $267 = self.pars;
                            var $268 = self.inds;
                            var $269 = self.ctrs;
                            return (() => {
                                var self = ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $270 = self.name;
                                        var $271 = self.args;
                                        var $272 = self.inds;
                                        return (() => {
                                            var ret$11 = Fm$Term$ref(Fm$Name$read("P"));
                                            var ret$12 = (list_for($272)(ret$11)((var$12 => (ret$13 => Fm$Term$app(ret$13)((() => {
                                                var self = var$12;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $273 = self.eras;
                                                        var $274 = self.name;
                                                        var $275 = self.term;
                                                        return $275;
                                                }
                                            })())))));
                                            var ctr$13 = String$flatten(List$cons($266)(List$cons(Fm$Name$read("."))(List$cons($270)(List$nil))));
                                            var slf$14 = Fm$Term$ref(ctr$13);
                                            var slf$15 = (list_for($267)(slf$14)((var$15 => (slf$16 => Fm$Term$app(slf$16)(Fm$Term$ref((() => {
                                                var self = var$15;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $276 = self.eras;
                                                        var $277 = self.name;
                                                        var $278 = self.term;
                                                        return $277;
                                                }
                                            })()))))));
                                            var slf$16 = (list_for($271)(slf$15)((var$16 => (slf$17 => Fm$Term$app(slf$17)(Fm$Term$ref((() => {
                                                var self = var$16;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $279 = self.eras;
                                                        var $280 = self.name;
                                                        var $281 = self.term;
                                                        return $280;
                                                }
                                            })()))))));
                                            return Fm$Term$app(ret$12)(slf$16)
                                        })();
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $282 = self.head;
                var $283 = self.tail;
                return (() => {
                    var eras$6 = (() => {
                        var self = $282;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $284 = self.eras;
                                var $285 = self.name;
                                var $286 = self.term;
                                return $284;
                        }
                    })();
                    var name$7 = (() => {
                        var self = $282;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $287 = self.eras;
                                var $288 = self.name;
                                var $289 = self.term;
                                return $288;
                        }
                    })();
                    var xtyp$8 = (() => {
                        var self = $282;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $290 = self.eras;
                                var $291 = self.name;
                                var $292 = self.term;
                                return $292;
                        }
                    })();
                    var body$9 = Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($283);
                    return Fm$Term$all(eras$6)("")(name$7)(xtyp$8)((s$10 => (x$11 => body$9)))
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructor = (type$1 => (ctor$2 => (() => {
        var self = ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $293 = self.name;
                var $294 = self.args;
                var $295 = self.inds;
                return Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($294);
        }
    })()));
    var Fm$Datatype$build_term$constructors$go = (type$1 => (name$2 => (ctrs$3 => (() => {
        var self = ctrs$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = type$1;
                    switch (self._) {
                        case 'Fm.Datatype.new':
                            var $296 = self.name;
                            var $297 = self.pars;
                            var $298 = self.inds;
                            var $299 = self.ctrs;
                            return (() => {
                                var ret$8 = Fm$Term$ref(Fm$Name$read("P"));
                                var ret$9 = (list_for($298)(ret$8)((var$9 => (ret$10 => Fm$Term$app(ret$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $300 = self.eras;
                                            var $301 = self.name;
                                            var $302 = self.term;
                                            return $301;
                                    }
                                })()))))));
                                return Fm$Term$app(ret$9)(Fm$Term$ref((name$2 + ".Self")))
                            })();
                    }
                })();
            case 'List.cons':
                var $303 = self.head;
                var $304 = self.tail;
                return (() => {
                    var self = $303;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $305 = self.name;
                            var $306 = self.args;
                            var $307 = self.inds;
                            return Fm$Term$all(Bool$false)("")($305)(Fm$Datatype$build_term$constructor(type$1)($303))((s$9 => (x$10 => Fm$Datatype$build_term$constructors$go(type$1)(name$2)($304))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructors = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $308 = self.name;
                var $309 = self.pars;
                var $310 = self.inds;
                var $311 = self.ctrs;
                return Fm$Datatype$build_term$constructors$go(type$1)($308)($311);
        }
    })());
    var Fm$Datatype$build_term$go = (type$1 => (name$2 => (pars$3 => (inds$4 => (() => {
        var self = pars$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = inds$4;
                    switch (self._) {
                        case 'List.nil':
                            return Fm$Term$all(Bool$false)((name$2 + ".Self"))(Fm$Name$read("P"))(Fm$Datatype$build_term$motive(type$1))((s$5 => (x$6 => Fm$Datatype$build_term$constructors(type$1))));
                        case 'List.cons':
                            var $312 = self.head;
                            var $313 = self.tail;
                            return (() => {
                                var self = $312;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $314 = self.eras;
                                        var $315 = self.name;
                                        var $316 = self.term;
                                        return Fm$Term$lam($315)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)(pars$3)($313)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $317 = self.head;
                var $318 = self.tail;
                return (() => {
                    var self = $317;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $319 = self.eras;
                            var $320 = self.name;
                            var $321 = self.term;
                            return Fm$Term$lam($320)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)($318)(inds$4)));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_term = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $322 = self.name;
                var $323 = self.pars;
                var $324 = self.inds;
                var $325 = self.ctrs;
                return Fm$Datatype$build_term$go(type$1)($322)($323)($324);
        }
    })());
    var Fm$Datatype$build_type$go = (type$1 => (name$2 => (pars$3 => (inds$4 => (() => {
        var self = pars$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = inds$4;
                    switch (self._) {
                        case 'List.nil':
                            return Fm$Term$typ;
                        case 'List.cons':
                            var $326 = self.head;
                            var $327 = self.tail;
                            return (() => {
                                var self = $326;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $328 = self.eras;
                                        var $329 = self.name;
                                        var $330 = self.term;
                                        return Fm$Term$all(Bool$false)("")($329)($330)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)(pars$3)($327))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $331 = self.head;
                var $332 = self.tail;
                return (() => {
                    var self = $331;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $333 = self.eras;
                            var $334 = self.name;
                            var $335 = self.term;
                            return Fm$Term$all(Bool$false)("")($334)($335)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)($332)(inds$4))));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_type = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $336 = self.name;
                var $337 = self.pars;
                var $338 = self.inds;
                var $339 = self.ctrs;
                return Fm$Datatype$build_type$go(type$1)($336)($337)($338);
        }
    })());
    var Fm$set = (name$2 => (val$3 => (map$4 => Map$set((fm_name_to_bits(name$2)))(val$3)(map$4))));
    var Fm$Constructor$build_term$opt$go = (type$1 => (ctor$2 => (ctrs$3 => (() => {
        var self = ctrs$3;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $340 = self.name;
                            var $341 = self.args;
                            var $342 = self.inds;
                            return (() => {
                                var ret$7 = Fm$Term$ref($340);
                                var ret$8 = (list_for($341)(ret$7)((arg$8 => (ret$9 => Fm$Term$app(ret$9)(Fm$Term$ref((() => {
                                    var self = arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $343 = self.eras;
                                            var $344 = self.name;
                                            var $345 = self.term;
                                            return $344;
                                    }
                                })()))))));
                                return ret$8
                            })();
                    }
                })();
            case 'List.cons':
                var $346 = self.head;
                var $347 = self.tail;
                return (() => {
                    var self = $346;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $348 = self.name;
                            var $349 = self.args;
                            var $350 = self.inds;
                            return Fm$Term$lam($348)((x$9 => Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($347)));
                    }
                })();
        }
    })())));
    var Fm$Constructor$build_term$opt = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $351 = self.name;
                var $352 = self.pars;
                var $353 = self.inds;
                var $354 = self.ctrs;
                return Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($354);
        }
    })()));
    var Fm$Constructor$build_term$go = (type$1 => (ctor$2 => (name$3 => (pars$4 => (args$5 => (() => {
        var self = pars$4;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = args$5;
                    switch (self._) {
                        case 'List.nil':
                            return Fm$Term$lam(Fm$Name$read("P"))((x$6 => Fm$Constructor$build_term$opt(type$1)(ctor$2)));
                        case 'List.cons':
                            var $355 = self.head;
                            var $356 = self.tail;
                            return (() => {
                                var self = $355;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $357 = self.eras;
                                        var $358 = self.name;
                                        var $359 = self.term;
                                        return Fm$Term$lam($358)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)(pars$4)($356)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $360 = self.head;
                var $361 = self.tail;
                return (() => {
                    var self = $360;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $362 = self.eras;
                            var $363 = self.name;
                            var $364 = self.term;
                            return Fm$Term$lam($363)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)($361)(args$5)));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_term = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $365 = self.name;
                var $366 = self.pars;
                var $367 = self.inds;
                var $368 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $369 = self.name;
                            var $370 = self.args;
                            var $371 = self.inds;
                            return Fm$Constructor$build_term$go(type$1)(ctor$2)($365)($366)($370);
                    }
                })();
        }
    })()));
    var Fm$Constructor$build_type$go = (type$1 => (ctor$2 => (name$3 => (pars$4 => (args$5 => (() => {
        var self = pars$4;
        switch (self._) {
            case 'List.nil':
                return (() => {
                    var self = args$5;
                    switch (self._) {
                        case 'List.nil':
                            return (() => {
                                var self = type$1;
                                switch (self._) {
                                    case 'Fm.Datatype.new':
                                        var $372 = self.name;
                                        var $373 = self.pars;
                                        var $374 = self.inds;
                                        var $375 = self.ctrs;
                                        return (() => {
                                            var self = ctor$2;
                                            switch (self._) {
                                                case 'Fm.Constructor.new':
                                                    var $376 = self.name;
                                                    var $377 = self.args;
                                                    var $378 = self.inds;
                                                    return (() => {
                                                        var type$13 = Fm$Term$ref(name$3);
                                                        var type$14 = (list_for($373)(type$13)((var$14 => (type$15 => Fm$Term$app(type$15)(Fm$Term$ref((() => {
                                                            var self = var$14;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $379 = self.eras;
                                                                    var $380 = self.name;
                                                                    var $381 = self.term;
                                                                    return $380;
                                                            }
                                                        })()))))));
                                                        var type$15 = (list_for($378)(type$14)((var$15 => (type$16 => Fm$Term$app(type$16)((() => {
                                                            var self = var$15;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $382 = self.eras;
                                                                    var $383 = self.name;
                                                                    var $384 = self.term;
                                                                    return $384;
                                                            }
                                                        })())))));
                                                        return type$15
                                                    })();
                                            }
                                        })();
                                }
                            })();
                        case 'List.cons':
                            var $385 = self.head;
                            var $386 = self.tail;
                            return (() => {
                                var self = $385;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $387 = self.eras;
                                        var $388 = self.name;
                                        var $389 = self.term;
                                        return Fm$Term$all($387)("")($388)($389)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)(pars$4)($386))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $390 = self.head;
                var $391 = self.tail;
                return (() => {
                    var self = $390;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $392 = self.eras;
                            var $393 = self.name;
                            var $394 = self.term;
                            return Fm$Term$all($392)("")($393)($394)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)($391)(args$5))));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_type = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $395 = self.name;
                var $396 = self.pars;
                var $397 = self.inds;
                var $398 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $399 = self.name;
                            var $400 = self.args;
                            var $401 = self.inds;
                            return Fm$Constructor$build_type$go(type$1)(ctor$2)($395)($396)($400);
                    }
                })();
        }
    })()));
    var Fm$Parser$file$go = (defs$1 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$definition))((def$2 => (() => {
        var self = def$2;
        switch (self._) {
            case 'Maybe.none':
                return Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$datatype))((adt$3 => (() => {
                    var self = adt$3;
                    switch (self._) {
                        case 'Maybe.none':
                            return Monad$pure(Parser$monad)(defs$1);
                        case 'Maybe.some':
                            var $402 = self.value;
                            return (() => {
                                var self = $402;
                                switch (self._) {
                                    case 'Fm.Datatype.new':
                                        var $403 = self.name;
                                        var $404 = self.pars;
                                        var $405 = self.inds;
                                        var $406 = self.ctrs;
                                        return (() => {
                                            var term$9 = Fm$Datatype$build_term($402);
                                            var term$10 = Fm$Term$bind(List$nil)((x$10 => Bits$1(x$10)))(term$9);
                                            var type$11 = Fm$Datatype$build_type($402);
                                            var type$12 = Fm$Term$bind(List$nil)((x$12 => Bits$0(x$12)))(type$11);
                                            var defs$13 = Fm$set($403)(Fm$Def$new($403)(term$10)(type$12)(Bool$false))(defs$1);
                                            var defs$14 = List$fold($406)(defs$13)((ctr$14 => (defs$15 => (() => {
                                                var typ_name$16 = $403;
                                                var ctr_name$17 = String$flatten(List$cons(typ_name$16)(List$cons(Fm$Name$read("."))(List$cons((() => {
                                                    var self = ctr$14;
                                                    switch (self._) {
                                                        case 'Fm.Constructor.new':
                                                            var $407 = self.name;
                                                            var $408 = self.args;
                                                            var $409 = self.inds;
                                                            return $407;
                                                    }
                                                })())(List$nil))));
                                                var ctr_term$18 = Fm$Constructor$build_term($402)(ctr$14);
                                                var ctr_term$19 = Fm$Term$bind(List$nil)((x$19 => Bits$1(x$19)))(ctr_term$18);
                                                var ctr_type$20 = Fm$Constructor$build_type($402)(ctr$14);
                                                var ctr_type$21 = Fm$Term$bind(List$nil)((x$21 => Bits$0(x$21)))(ctr_type$20);
                                                return Fm$set(ctr_name$17)(Fm$Def$new(ctr_name$17)(ctr_term$19)(ctr_type$21)(Bool$false))(defs$15)
                                            })())));
                                            return Fm$Parser$file$go(defs$14)
                                        })();
                                }
                            })();
                    }
                })()));
            case 'Maybe.some':
                var $410 = self.value;
                return (() => {
                    var self = $410;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $411 = self.name;
                            var $412 = self.term;
                            var $413 = self.type;
                            var $414 = self.done;
                            return Fm$Parser$file$go(Fm$set($411)($410)(defs$1));
                    }
                })();
        }
    })())));
    var Fm$Parser$file = Fm$Parser$file$go(Map$new);
    var Fm$Defs$read = (code$1 => (() => {
        var self = Fm$Parser$file(code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $415 = self.code;
                var $416 = self.err;
                return Maybe$none;
            case 'Parser.Reply.value':
                var $417 = self.code;
                var $418 = self.val;
                return Maybe$some($418);
        }
    })());
    var Map$to_list$go = (xs$2 => (key$3 => (list$4 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'Map.new':
                return list$4;
            case 'Map.tie':
                var $419 = self.val;
                var $420 = self.lft;
                var $421 = self.rgt;
                return (() => {
                    var list0$8 = (() => {
                        var self = $419;
                        switch (self._) {
                            case 'Maybe.none':
                                return list$4;
                            case 'Maybe.some':
                                var $422 = self.value;
                                return List$cons(Pair$new(Bits$reverse(key$3))($422))(list$4);
                        }
                    })();
                    var list1$9 = Map$to_list$go($420)(Bits$0(key$3))(list0$8);
                    var list2$10 = Map$to_list$go($421)(Bits$1(key$3))(list1$9);
                    return list2$10
                })();
        }
    })())));
    var Map$to_list = (xs$2 => List$reverse(Map$to_list$go(xs$2)(Bits$nil)(List$nil)));
    var Bits$chunks_of$go = (len$1 => (bits$2 => (need$3 => (chunk$4 => (() => {
        var self = bits$2;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return List$cons(Bits$reverse(chunk$4))(List$nil);
            case '0':
                var $423 = self.slice(0, -1);
                return (() => {
                    var self = need$3;
                    switch (self === 0n ? 'zero' : 'succ') {
                        case 'zero':
                            return (() => {
                                var head$6 = Bits$reverse(chunk$4);
                                var tail$7 = Bits$chunks_of$go(len$1)(bits$2)(len$1)(Bits$nil);
                                return List$cons(head$6)(tail$7)
                            })();
                        case 'succ':
                            var $424 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$0(chunk$4);
                                return Bits$chunks_of$go(len$1)($423)($424)(chunk$7)
                            })();
                    }
                })();
            case '1':
                var $425 = self.slice(0, -1);
                return (() => {
                    var self = need$3;
                    switch (self === 0n ? 'zero' : 'succ') {
                        case 'zero':
                            return (() => {
                                var head$6 = Bits$reverse(chunk$4);
                                var tail$7 = Bits$chunks_of$go(len$1)(bits$2)(len$1)(Bits$nil);
                                return List$cons(head$6)(tail$7)
                            })();
                        case 'succ':
                            var $426 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$1(chunk$4);
                                return Bits$chunks_of$go(len$1)($425)($426)(chunk$7)
                            })();
                    }
                })();
        }
    })()))));
    var Bits$chunks_of = (len$1 => (bits$2 => Bits$chunks_of$go(len$1)(bits$2)(len$1)(Bits$nil)));
    var Word$from_bits = (size$1 => (bits$2 => (() => {
        var self = size$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $427 = (self - 1n);
                return (() => {
                    var self = bits$2;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return Word$0(Word$from_bits($427)(Bits$nil));
                        case '0':
                            var $428 = self.slice(0, -1);
                            return Word$0(Word$from_bits($427)($428));
                        case '1':
                            var $429 = self.slice(0, -1);
                            return Word$1(Word$from_bits($427)($429));
                    }
                })();
        }
    })()));
    var Fm$Name$from_bits = (bits$1 => (() => {
        var list$2 = Bits$chunks_of(6n)(bits$1);
        var name$3 = List$fold(list$2)(String$nil)((bts$3 => (name$4 => (() => {
            var u16$5 = U16$new(Word$from_bits(16n)(Bits$reverse(bts$3)));
            var chr$6 = (() => {
                var self = U16$btw(0)(u16$5)(25);
                switch (self ? 'true' : 'false') {
                    case 'true':
                        return ((u16$5 + 65) & 0xFFFF);
                    case 'false':
                        return (() => {
                            var self = U16$btw(26)(u16$5)(51);
                            switch (self ? 'true' : 'false') {
                                case 'true':
                                    return ((u16$5 + 71) & 0xFFFF);
                                case 'false':
                                    return (() => {
                                        var self = U16$btw(52)(u16$5)(61);
                                        switch (self ? 'true' : 'false') {
                                            case 'true':
                                                return (Math.max(u16$5 - 4, 0));
                                            case 'false':
                                                return (() => {
                                                    var self = (62 === u16$5);
                                                    switch (self ? 'true' : 'false') {
                                                        case 'true':
                                                            return 46;
                                                        case 'false':
                                                            return 95;
                                                    }
                                                })();
                                        }
                                    })();
                            }
                        })();
                }
            })();
            return String$cons(chr$6)(name$4)
        })())));
        return name$3
    })());
    var Fm$Check = (V$1 => null);
    var Fm$Check$result = (value$2 => (errors$3 => ({
        _: 'Fm.Check.result',
        'value': value$2,
        'errors': errors$3
    })));
    var Fm$Check$bind = (a$3 => (f$4 => (() => {
        var self = a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $430 = self.value;
                var $431 = self.errors;
                return (() => {
                    var self = $430;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)($431);
                        case 'Maybe.some':
                            var $432 = self.value;
                            return (() => {
                                var self = f$4($432);
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $433 = self.value;
                                        var $434 = self.errors;
                                        return Fm$Check$result($433)(List$concat($431)($434));
                                }
                            })();
                    }
                })();
        }
    })()));
    var Fm$Check$pure = (value$2 => Fm$Check$result(Maybe$some(value$2))(List$nil));
    var Fm$Check$monad = Monad$new(Fm$Check$bind)(Fm$Check$pure);
    var Fm$Error$undefined_reference = (name$1 => ({
        _: 'Fm.Error.undefined_reference',
        'name': name$1
    }));
    var Map$get = bits$2 => map$3 => {
        var Map$get = bits$2 => map$3 => ({
            ctr: 'TCO',
            arg: [bits$2, map$3]
        });
        var arg = [bits$2, map$3];
        while (true) {
            let [bits$2, map$3] = arg;
            var R = (() => {
                var self = bits$2;
                switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                    case 'nil':
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $435 = self.val;
                                    var $436 = self.lft;
                                    var $437 = self.rgt;
                                    return $435;
                            }
                        })();
                    case '0':
                        var $438 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $439 = self.val;
                                    var $440 = self.lft;
                                    var $441 = self.rgt;
                                    return Map$get($438)($440);
                            }
                        })();
                    case '1':
                        var $442 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $443 = self.val;
                                    var $444 = self.lft;
                                    var $445 = self.rgt;
                                    return Map$get($442)($445);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Fm$get = (name$2 => (map$3 => Map$get((fm_name_to_bits(name$2)))(map$3)));
    var Maybe$mapped = (m$2 => (f$4 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Maybe.none':
                return Maybe$none;
            case 'Maybe.some':
                var $446 = self.value;
                return Maybe$some(f$4($446));
        }
    })()));
    var Fm$MPath$0 = (path$1 => Maybe$mapped(path$1)(Fm$Path$0));
    var Fm$MPath$1 = (path$1 => Maybe$mapped(path$1)(Fm$Path$1));
    var Fm$Error$cant_infer = (term$1 => (context$2 => ({
        _: 'Fm.Error.cant_infer',
        'term': term$1,
        'context': context$2
    })));
    var Fm$Term$unroll_nat = (natx$1 => (() => {
        var self = natx$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Fm$Term$ref(Fm$Name$read("Nat.zero"));
            case 'succ':
                var $447 = (self - 1n);
                return (() => {
                    var func$3 = Fm$Term$ref(Fm$Name$read("Nat.succ"));
                    var argm$4 = Fm$Term$nat($447);
                    return Fm$Term$app(func$3)(argm$4)
                })();
        }
    })());
    var Fm$Term$unroll_chr$bits = (bits$1 => (() => {
        var self = bits$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return Fm$Term$ref(Fm$Name$read("Bits.nil"));
            case '0':
                var $448 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.0")))(Fm$Term$unroll_chr$bits($448));
            case '1':
                var $449 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.1")))(Fm$Term$unroll_chr$bits($449));
        }
    })());
    var Fm$Term$unroll_chr = (chrx$1 => (() => {
        var self = chrx$1;
        switch ('u16') {
            case 'u16':
                var $450 = u16_to_word(self);
                return (() => {
                    var term$3 = Fm$Term$ref(Fm$Name$read("Word.from_bits"));
                    var term$4 = Fm$Term$app(term$3)(Fm$Term$nat(16n));
                    var term$5 = Fm$Term$app(term$4)(Fm$Term$unroll_chr$bits(Word$to_bits($450)));
                    var term$6 = Fm$Term$app(Fm$Term$ref(Fm$Name$read("U16.new")))(term$5);
                    return term$6
                })();
        }
    })());
    var Fm$Term$unroll_str = (strx$1 => (() => {
        var self = strx$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Fm$Term$ref(Fm$Name$read("String.nil"));
            case 'cons':
                var $451 = self.charCodeAt(0);
                var $452 = self.slice(1);
                return (() => {
                    var char$4 = Fm$Term$chr($451);
                    var term$5 = Fm$Term$ref(Fm$Name$read("String.cons"));
                    var term$6 = Fm$Term$app(term$5)(char$4);
                    var term$7 = Fm$Term$app(term$6)(Fm$Term$str($452));
                    return term$7
                })();
        }
    })());
    var Fm$Term$reduce = (term$1 => (defs$2 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $453 = self.name;
                var $454 = self.indx;
                return term$1;
            case 'Fm.Term.ref':
                var $455 = self.name;
                return (() => {
                    var self = Fm$get($455)(defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($455);
                        case 'Maybe.some':
                            var $456 = self.value;
                            return (() => {
                                var self = $456;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $457 = self.name;
                                        var $458 = self.term;
                                        var $459 = self.type;
                                        var $460 = self.done;
                                        return Fm$Term$reduce($458)(defs$2);
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$1;
            case 'Fm.Term.all':
                var $461 = self.eras;
                var $462 = self.self;
                var $463 = self.name;
                var $464 = self.xtyp;
                var $465 = self.body;
                return term$1;
            case 'Fm.Term.lam':
                var $466 = self.name;
                var $467 = self.body;
                return term$1;
            case 'Fm.Term.app':
                var $468 = self.func;
                var $469 = self.argm;
                return (() => {
                    var func$5 = Fm$Term$reduce($468)(defs$2);
                    return (() => {
                        var self = func$5;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $470 = self.name;
                                var $471 = self.indx;
                                return term$1;
                            case 'Fm.Term.ref':
                                var $472 = self.name;
                                return term$1;
                            case 'Fm.Term.typ':
                                return term$1;
                            case 'Fm.Term.all':
                                var $473 = self.eras;
                                var $474 = self.self;
                                var $475 = self.name;
                                var $476 = self.xtyp;
                                var $477 = self.body;
                                return term$1;
                            case 'Fm.Term.lam':
                                var $478 = self.name;
                                var $479 = self.body;
                                return Fm$Term$reduce($479($469))(defs$2);
                            case 'Fm.Term.app':
                                var $480 = self.func;
                                var $481 = self.argm;
                                return term$1;
                            case 'Fm.Term.let':
                                var $482 = self.name;
                                var $483 = self.expr;
                                var $484 = self.body;
                                return term$1;
                            case 'Fm.Term.def':
                                var $485 = self.name;
                                var $486 = self.expr;
                                var $487 = self.body;
                                return term$1;
                            case 'Fm.Term.ann':
                                var $488 = self.done;
                                var $489 = self.term;
                                var $490 = self.type;
                                return term$1;
                            case 'Fm.Term.gol':
                                var $491 = self.name;
                                var $492 = self.dref;
                                var $493 = self.verb;
                                return term$1;
                            case 'Fm.Term.hol':
                                var $494 = self.path;
                                return term$1;
                            case 'Fm.Term.nat':
                                var $495 = self.natx;
                                return term$1;
                            case 'Fm.Term.chr':
                                var $496 = self.chrx;
                                return term$1;
                            case 'Fm.Term.str':
                                var $497 = self.strx;
                                return term$1;
                            case 'Fm.Term.sug':
                                var $498 = self.sugx;
                                return term$1;
                        }
                    })()
                })();
            case 'Fm.Term.let':
                var $499 = self.name;
                var $500 = self.expr;
                var $501 = self.body;
                return Fm$Term$reduce($501($500))(defs$2);
            case 'Fm.Term.def':
                var $502 = self.name;
                var $503 = self.expr;
                var $504 = self.body;
                return Fm$Term$reduce($504($503))(defs$2);
            case 'Fm.Term.ann':
                var $505 = self.done;
                var $506 = self.term;
                var $507 = self.type;
                return Fm$Term$reduce($506)(defs$2);
            case 'Fm.Term.gol':
                var $508 = self.name;
                var $509 = self.dref;
                var $510 = self.verb;
                return term$1;
            case 'Fm.Term.hol':
                var $511 = self.path;
                return term$1;
            case 'Fm.Term.nat':
                var $512 = self.natx;
                return Fm$Term$reduce(Fm$Term$unroll_nat($512))(defs$2);
            case 'Fm.Term.chr':
                var $513 = self.chrx;
                return Fm$Term$reduce(Fm$Term$unroll_chr($513))(defs$2);
            case 'Fm.Term.str':
                var $514 = self.strx;
                return Fm$Term$reduce(Fm$Term$unroll_str($514))(defs$2);
            case 'Fm.Term.sug':
                var $515 = self.sugx;
                return term$1;
        }
    })()));
    var Fm$Error$type_mismatch = (expected$1 => (detected$2 => (context$3 => ({
        _: 'Fm.Error.type_mismatch',
        'expected': expected$1,
        'detected': detected$2,
        'context': context$3
    }))));
    var Either$left = (value$3 => ({
        _: 'Either.left',
        'value': value$3
    }));
    var Either$right = (value$3 => ({
        _: 'Either.right',
        'value': value$3
    }));
    var Fm$Error$show_goal = (name$1 => (dref$2 => (verb$3 => (goal$4 => (context$5 => ({
        _: 'Fm.Error.show_goal',
        'name': name$1,
        'dref': dref$2,
        'verb': verb$3,
        'goal': goal$4,
        'context': context$5
    }))))));
    var Fm$Term$desugar_app = func$1 => args$2 => type$3 => defs$4 => {
        var Fm$Term$desugar_app = func$1 => args$2 => type$3 => defs$4 => ({
            ctr: 'TCO',
            arg: [func$1, args$2, type$3, defs$4]
        });
        var arg = [func$1, args$2, type$3, defs$4];
        while (true) {
            let [func$1, args$2, type$3, defs$4] = arg;
            var R = (() => {
                var self = Fm$Term$reduce(type$3)(defs$4);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $516 = self.name;
                        var $517 = self.indx;
                        return func$1;
                    case 'Fm.Term.ref':
                        var $518 = self.name;
                        return func$1;
                    case 'Fm.Term.typ':
                        return func$1;
                    case 'Fm.Term.all':
                        var $519 = self.eras;
                        var $520 = self.self;
                        var $521 = self.name;
                        var $522 = self.xtyp;
                        var $523 = self.body;
                        return (() => {
                            var self = Fm$get($521)(args$2);
                            switch (self._) {
                                case 'Maybe.none':
                                    return func$1;
                                case 'Maybe.some':
                                    var $524 = self.value;
                                    return (() => {
                                        var func$11 = Fm$Term$app(func$1)($524);
                                        var type$12 = $523(Fm$Term$var($520)(0n))(Fm$Term$var($521)(0n));
                                        return Fm$Term$desugar_app(func$11)(args$2)(type$12)(defs$4)
                                    })();
                            }
                        })();
                    case 'Fm.Term.lam':
                        var $525 = self.name;
                        var $526 = self.body;
                        return func$1;
                    case 'Fm.Term.app':
                        var $527 = self.func;
                        var $528 = self.argm;
                        return func$1;
                    case 'Fm.Term.let':
                        var $529 = self.name;
                        var $530 = self.expr;
                        var $531 = self.body;
                        return func$1;
                    case 'Fm.Term.def':
                        var $532 = self.name;
                        var $533 = self.expr;
                        var $534 = self.body;
                        return func$1;
                    case 'Fm.Term.ann':
                        var $535 = self.done;
                        var $536 = self.term;
                        var $537 = self.type;
                        return func$1;
                    case 'Fm.Term.gol':
                        var $538 = self.name;
                        var $539 = self.dref;
                        var $540 = self.verb;
                        return func$1;
                    case 'Fm.Term.hol':
                        var $541 = self.path;
                        return func$1;
                    case 'Fm.Term.nat':
                        var $542 = self.natx;
                        return func$1;
                    case 'Fm.Term.chr':
                        var $543 = self.chrx;
                        return func$1;
                    case 'Fm.Term.str':
                        var $544 = self.strx;
                        return func$1;
                    case 'Fm.Term.sug':
                        var $545 = self.sugx;
                        return func$1;
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Fm$Error$patch = (path$1 => (term$2 => ({
        _: 'Fm.Error.patch',
        'path': path$1,
        'term': term$2
    })));
    var Fm$MPath$to_bits = (path$1 => (() => {
        var self = path$1;
        switch (self._) {
            case 'Maybe.none':
                return Bits$nil;
            case 'Maybe.some':
                var $546 = self.value;
                return $546(Bits$nil);
        }
    })());
    var Fm$Term$desugar_cse$motive = (wyth$1 => (moti$2 => (() => {
        var self = wyth$1;
        switch (self._) {
            case 'List.nil':
                return moti$2;
            case 'List.cons':
                var $547 = self.head;
                var $548 = self.tail;
                return (() => {
                    var self = $547;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $549 = self.name;
                            var $550 = self.term;
                            var $551 = self.type;
                            var $552 = self.done;
                            return Fm$Term$all(Bool$false)("")($549)($551)((s$9 => (x$10 => Fm$Term$desugar_cse$motive($548)(moti$2))));
                    }
                })();
        }
    })()));
    var Fm$Term$desugar_cse$argument = (name$1 => (wyth$2 => (type$3 => (body$4 => (defs$5 => (() => {
        var self = Fm$Term$reduce(type$3)(defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $553 = self.name;
                var $554 = self.indx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $555 = self.head;
                            var $556 = self.tail;
                            return (() => {
                                var self = $555;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $557 = self.name;
                                        var $558 = self.term;
                                        var $559 = self.type;
                                        var $560 = self.done;
                                        return Fm$Term$lam($557)((x$14 => Fm$Term$desugar_cse$argument(name$1)($556)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $561 = self.name;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $562 = self.head;
                            var $563 = self.tail;
                            return (() => {
                                var self = $562;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $564 = self.name;
                                        var $565 = self.term;
                                        var $566 = self.type;
                                        var $567 = self.done;
                                        return Fm$Term$lam($564)((x$13 => Fm$Term$desugar_cse$argument(name$1)($563)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $568 = self.head;
                            var $569 = self.tail;
                            return (() => {
                                var self = $568;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $570 = self.name;
                                        var $571 = self.term;
                                        var $572 = self.type;
                                        var $573 = self.done;
                                        return Fm$Term$lam($570)((x$12 => Fm$Term$desugar_cse$argument(name$1)($569)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.all':
                var $574 = self.eras;
                var $575 = self.self;
                var $576 = self.name;
                var $577 = self.xtyp;
                var $578 = self.body;
                return Fm$Term$lam(String$flatten(List$cons(name$1)(List$cons(Fm$Name$read("."))(List$cons($576)(List$nil)))))((x$11 => Fm$Term$desugar_cse$argument(name$1)(wyth$2)($578(Fm$Term$var($575)(0n))(Fm$Term$var($576)(0n)))(body$4)(defs$5)));
            case 'Fm.Term.lam':
                var $579 = self.name;
                var $580 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $581 = self.head;
                            var $582 = self.tail;
                            return (() => {
                                var self = $581;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $583 = self.name;
                                        var $584 = self.term;
                                        var $585 = self.type;
                                        var $586 = self.done;
                                        return Fm$Term$lam($583)((x$14 => Fm$Term$desugar_cse$argument(name$1)($582)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $587 = self.func;
                var $588 = self.argm;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $589 = self.head;
                            var $590 = self.tail;
                            return (() => {
                                var self = $589;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $591 = self.name;
                                        var $592 = self.term;
                                        var $593 = self.type;
                                        var $594 = self.done;
                                        return Fm$Term$lam($591)((x$14 => Fm$Term$desugar_cse$argument(name$1)($590)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.let':
                var $595 = self.name;
                var $596 = self.expr;
                var $597 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $598 = self.head;
                            var $599 = self.tail;
                            return (() => {
                                var self = $598;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $600 = self.name;
                                        var $601 = self.term;
                                        var $602 = self.type;
                                        var $603 = self.done;
                                        return Fm$Term$lam($600)((x$15 => Fm$Term$desugar_cse$argument(name$1)($599)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.def':
                var $604 = self.name;
                var $605 = self.expr;
                var $606 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $607 = self.head;
                            var $608 = self.tail;
                            return (() => {
                                var self = $607;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $609 = self.name;
                                        var $610 = self.term;
                                        var $611 = self.type;
                                        var $612 = self.done;
                                        return Fm$Term$lam($609)((x$15 => Fm$Term$desugar_cse$argument(name$1)($608)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ann':
                var $613 = self.done;
                var $614 = self.term;
                var $615 = self.type;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $616 = self.head;
                            var $617 = self.tail;
                            return (() => {
                                var self = $616;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $618 = self.name;
                                        var $619 = self.term;
                                        var $620 = self.type;
                                        var $621 = self.done;
                                        return Fm$Term$lam($618)((x$15 => Fm$Term$desugar_cse$argument(name$1)($617)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.gol':
                var $622 = self.name;
                var $623 = self.dref;
                var $624 = self.verb;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $625 = self.head;
                            var $626 = self.tail;
                            return (() => {
                                var self = $625;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $627 = self.name;
                                        var $628 = self.term;
                                        var $629 = self.type;
                                        var $630 = self.done;
                                        return Fm$Term$lam($627)((x$15 => Fm$Term$desugar_cse$argument(name$1)($626)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.hol':
                var $631 = self.path;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $632 = self.head;
                            var $633 = self.tail;
                            return (() => {
                                var self = $632;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $634 = self.name;
                                        var $635 = self.term;
                                        var $636 = self.type;
                                        var $637 = self.done;
                                        return Fm$Term$lam($634)((x$13 => Fm$Term$desugar_cse$argument(name$1)($633)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.nat':
                var $638 = self.natx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $639 = self.head;
                            var $640 = self.tail;
                            return (() => {
                                var self = $639;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $641 = self.name;
                                        var $642 = self.term;
                                        var $643 = self.type;
                                        var $644 = self.done;
                                        return Fm$Term$lam($641)((x$13 => Fm$Term$desugar_cse$argument(name$1)($640)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.chr':
                var $645 = self.chrx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $646 = self.head;
                            var $647 = self.tail;
                            return (() => {
                                var self = $646;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $648 = self.name;
                                        var $649 = self.term;
                                        var $650 = self.type;
                                        var $651 = self.done;
                                        return Fm$Term$lam($648)((x$13 => Fm$Term$desugar_cse$argument(name$1)($647)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.str':
                var $652 = self.strx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $653 = self.head;
                            var $654 = self.tail;
                            return (() => {
                                var self = $653;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $655 = self.name;
                                        var $656 = self.term;
                                        var $657 = self.type;
                                        var $658 = self.done;
                                        return Fm$Term$lam($655)((x$13 => Fm$Term$desugar_cse$argument(name$1)($654)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.sug':
                var $659 = self.sugx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $660 = self.head;
                            var $661 = self.tail;
                            return (() => {
                                var self = $660;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $662 = self.name;
                                        var $663 = self.term;
                                        var $664 = self.type;
                                        var $665 = self.done;
                                        return Fm$Term$lam($662)((x$13 => Fm$Term$desugar_cse$argument(name$1)($661)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
        }
    })())))));
    var Maybe$or = (a$2 => (b$3 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Maybe.none':
                return b$3;
            case 'Maybe.some':
                var $666 = self.value;
                return Maybe$some($666);
        }
    })()));
    var Fm$Term$desugar_cse$cases = expr$1 => name$2 => wyth$3 => cses$4 => type$5 => defs$6 => ctxt$7 => {
        var Fm$Term$desugar_cse$cases = expr$1 => name$2 => wyth$3 => cses$4 => type$5 => defs$6 => ctxt$7 => ({
            ctr: 'TCO',
            arg: [expr$1, name$2, wyth$3, cses$4, type$5, defs$6, ctxt$7]
        });
        var arg = [expr$1, name$2, wyth$3, cses$4, type$5, defs$6, ctxt$7];
        while (true) {
            let [expr$1, name$2, wyth$3, cses$4, type$5, defs$6, ctxt$7] = arg;
            var R = (() => {
                var self = Fm$Term$reduce(type$5)(defs$6);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $667 = self.name;
                        var $668 = self.indx;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $669 = self.name;
                                        var $670 = self.term;
                                        var $671 = self.type;
                                        var $672 = self.done;
                                        return $670;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.ref':
                        var $673 = self.name;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $674 = self.name;
                                        var $675 = self.term;
                                        var $676 = self.type;
                                        var $677 = self.done;
                                        return $675;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.typ':
                        return (() => {
                            var expr$8 = (list_for(wyth$3)(expr$1)((def$8 => (expr$9 => Fm$Term$app(expr$9)((() => {
                                var self = def$8;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $678 = self.name;
                                        var $679 = self.term;
                                        var $680 = self.type;
                                        var $681 = self.done;
                                        return $679;
                                }
                            })())))));
                            return expr$8
                        })();
                    case 'Fm.Term.all':
                        var $682 = self.eras;
                        var $683 = self.self;
                        var $684 = self.name;
                        var $685 = self.xtyp;
                        var $686 = self.body;
                        return (() => {
                            var got$13 = Maybe$or(Fm$get($684)(cses$4))(Fm$get("_")(cses$4));
                            return (() => {
                                var self = got$13;
                                switch (self._) {
                                    case 'Maybe.none':
                                        return (() => {
                                            var expr$14 = (list_for(wyth$3)(expr$1)((def$14 => (expr$15 => (() => {
                                                var self = def$14;
                                                switch (self._) {
                                                    case 'Fm.Def.new':
                                                        var $687 = self.name;
                                                        var $688 = self.term;
                                                        var $689 = self.type;
                                                        var $690 = self.done;
                                                        return Fm$Term$app(expr$15)($688);
                                                }
                                            })()))));
                                            return expr$14
                                        })();
                                    case 'Maybe.some':
                                        var $691 = self.value;
                                        return (() => {
                                            var argm$15 = Fm$Term$desugar_cse$argument(name$2)(wyth$3)($685)($691)(defs$6);
                                            var expr$16 = Fm$Term$app(expr$1)(argm$15);
                                            var type$17 = $686(Fm$Term$var($683)(0n))(Fm$Term$var($684)(0n));
                                            return Fm$Term$desugar_cse$cases(expr$16)(name$2)(wyth$3)(cses$4)(type$17)(defs$6)(ctxt$7)
                                        })();
                                }
                            })()
                        })();
                    case 'Fm.Term.lam':
                        var $692 = self.name;
                        var $693 = self.body;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $694 = self.name;
                                        var $695 = self.term;
                                        var $696 = self.type;
                                        var $697 = self.done;
                                        return $695;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.app':
                        var $698 = self.func;
                        var $699 = self.argm;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $700 = self.name;
                                        var $701 = self.term;
                                        var $702 = self.type;
                                        var $703 = self.done;
                                        return $701;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.let':
                        var $704 = self.name;
                        var $705 = self.expr;
                        var $706 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $707 = self.name;
                                        var $708 = self.term;
                                        var $709 = self.type;
                                        var $710 = self.done;
                                        return $708;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.def':
                        var $711 = self.name;
                        var $712 = self.expr;
                        var $713 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $714 = self.name;
                                        var $715 = self.term;
                                        var $716 = self.type;
                                        var $717 = self.done;
                                        return $715;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.ann':
                        var $718 = self.done;
                        var $719 = self.term;
                        var $720 = self.type;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $721 = self.name;
                                        var $722 = self.term;
                                        var $723 = self.type;
                                        var $724 = self.done;
                                        return $722;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.gol':
                        var $725 = self.name;
                        var $726 = self.dref;
                        var $727 = self.verb;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $728 = self.name;
                                        var $729 = self.term;
                                        var $730 = self.type;
                                        var $731 = self.done;
                                        return $729;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.hol':
                        var $732 = self.path;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $733 = self.name;
                                        var $734 = self.term;
                                        var $735 = self.type;
                                        var $736 = self.done;
                                        return $734;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.nat':
                        var $737 = self.natx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $738 = self.name;
                                        var $739 = self.term;
                                        var $740 = self.type;
                                        var $741 = self.done;
                                        return $739;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.chr':
                        var $742 = self.chrx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $743 = self.name;
                                        var $744 = self.term;
                                        var $745 = self.type;
                                        var $746 = self.done;
                                        return $744;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.str':
                        var $747 = self.strx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $748 = self.name;
                                        var $749 = self.term;
                                        var $750 = self.type;
                                        var $751 = self.done;
                                        return $749;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.sug':
                        var $752 = self.sugx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $753 = self.name;
                                        var $754 = self.term;
                                        var $755 = self.type;
                                        var $756 = self.done;
                                        return $754;
                                }
                            })())))));
                            return expr$9
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Fm$Term$desugar_cse = (expr$1 => (name$2 => (with$3 => (cses$4 => (moti$5 => (type$6 => (defs$7 => (ctxt$8 => (() => {
        var self = Fm$Term$reduce(type$6)(defs$7);
        switch (self._) {
            case 'Fm.Term.var':
                var $757 = self.name;
                var $758 = self.indx;
                return Maybe$none;
            case 'Fm.Term.ref':
                var $759 = self.name;
                return Maybe$none;
            case 'Fm.Term.typ':
                return Maybe$none;
            case 'Fm.Term.all':
                var $760 = self.eras;
                var $761 = self.self;
                var $762 = self.name;
                var $763 = self.xtyp;
                var $764 = self.body;
                return (() => {
                    var moti$14 = Fm$Term$desugar_cse$motive(with$3)(moti$5);
                    var argm$15 = Fm$Term$desugar_cse$argument(name$2)(List$nil)($763)(moti$14)(defs$7);
                    var expr$16 = Fm$Term$app(expr$1)(argm$15);
                    var type$17 = $764(Fm$Term$var($761)(0n))(Fm$Term$var($762)(0n));
                    return Maybe$some(Fm$Term$desugar_cse$cases(expr$16)(name$2)(with$3)(cses$4)(type$17)(defs$7)(ctxt$8))
                })();
            case 'Fm.Term.lam':
                var $765 = self.name;
                var $766 = self.body;
                return Maybe$none;
            case 'Fm.Term.app':
                var $767 = self.func;
                var $768 = self.argm;
                return Maybe$none;
            case 'Fm.Term.let':
                var $769 = self.name;
                var $770 = self.expr;
                var $771 = self.body;
                return Maybe$none;
            case 'Fm.Term.def':
                var $772 = self.name;
                var $773 = self.expr;
                var $774 = self.body;
                return Maybe$none;
            case 'Fm.Term.ann':
                var $775 = self.done;
                var $776 = self.term;
                var $777 = self.type;
                return Maybe$none;
            case 'Fm.Term.gol':
                var $778 = self.name;
                var $779 = self.dref;
                var $780 = self.verb;
                return Maybe$none;
            case 'Fm.Term.hol':
                var $781 = self.path;
                return Maybe$none;
            case 'Fm.Term.nat':
                var $782 = self.natx;
                return Maybe$none;
            case 'Fm.Term.chr':
                var $783 = self.chrx;
                return Maybe$none;
            case 'Fm.Term.str':
                var $784 = self.strx;
                return Maybe$none;
            case 'Fm.Term.sug':
                var $785 = self.sugx;
                return Maybe$none;
        }
    })()))))))));
    var Cmp$as_gte = (cmp$1 => (() => {
        var self = cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                return Bool$false;
            case 'Cmp.eql':
                return Bool$true;
            case 'Cmp.gtn':
                return Bool$true;
        }
    })());
    var Nat$cmp = a$1 => b$2 => {
        var Nat$cmp = a$1 => b$2 => ({
            ctr: 'TCO',
            arg: [a$1, b$2]
        });
        var arg = [a$1, b$2];
        while (true) {
            let [a$1, b$2] = arg;
            var R = (() => {
                var self = a$1;
                switch (self === 0n ? 'zero' : 'succ') {
                    case 'zero':
                        return (() => {
                            var self = b$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Cmp$eql;
                                case 'succ':
                                    var $786 = (self - 1n);
                                    return Cmp$ltn;
                            }
                        })();
                    case 'succ':
                        var $787 = (self - 1n);
                        return (() => {
                            var self = b$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Cmp$gtn;
                                case 'succ':
                                    var $788 = (self - 1n);
                                    return Nat$cmp($787)($788);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$gte = a0 => a1 => (a0 >= a1);
    var Nat$pred = (n$1 => (() => {
        var self = n$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Nat$zero;
            case 'succ':
                var $789 = (self - 1n);
                return $789;
        }
    })());
    var Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);
    var Fm$Term$serialize$go = (term$1 => (depth$2 => (init$3 => (x$4 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $790 = self.name;
                var $791 = self.indx;
                return (() => {
                    var self = ($791 >= init$3);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits(Nat$pred((depth$2 - $791 <= 0n ? 0n : depth$2 - $791)))));
                                return Bits$0(Bits$0(Bits$1(name$7(x$4))))
                            })();
                        case 'false':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits($791)));
                                return Bits$0(Bits$1(Bits$0(name$7(x$4))))
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $792 = self.name;
                return (() => {
                    var name$6 = a1 => (a1 + (fm_name_to_bits($792)));
                    return Bits$0(Bits$0(Bits$0(name$6(x$4))))
                })();
            case 'Fm.Term.typ':
                return Bits$0(Bits$1(Bits$1(x$4)));
            case 'Fm.Term.all':
                var $793 = self.eras;
                var $794 = self.self;
                var $795 = self.name;
                var $796 = self.xtyp;
                var $797 = self.body;
                return (() => {
                    var self$10 = a1 => (a1 + (fm_name_to_bits($794)));
                    var xtyp$11 = Fm$Term$serialize$go($796)(depth$2)(init$3);
                    var body$12 = Fm$Term$serialize$go($797(Fm$Term$var($794)(depth$2))(Fm$Term$var($795)(Nat$succ(depth$2))))(Nat$succ(Nat$succ(depth$2)))(init$3);
                    return Bits$1(Bits$0(Bits$0(self$10(xtyp$11(body$12(x$4))))))
                })();
            case 'Fm.Term.lam':
                var $798 = self.name;
                var $799 = self.body;
                return (() => {
                    var body$7 = Fm$Term$serialize$go($799(Fm$Term$var($798)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return Bits$1(Bits$0(Bits$1(body$7(x$4))))
                })();
            case 'Fm.Term.app':
                var $800 = self.func;
                var $801 = self.argm;
                return (() => {
                    var func$7 = Fm$Term$serialize$go($800)(depth$2)(init$3);
                    var argm$8 = Fm$Term$serialize$go($801)(depth$2)(init$3);
                    return Bits$1(Bits$1(Bits$0(func$7(argm$8(x$4)))))
                })();
            case 'Fm.Term.let':
                var $802 = self.name;
                var $803 = self.expr;
                var $804 = self.body;
                return (() => {
                    var expr$8 = Fm$Term$serialize$go($803)(depth$2)(init$3);
                    var body$9 = Fm$Term$serialize$go($804(Fm$Term$var($802)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return Bits$1(Bits$1(Bits$1(expr$8(body$9(x$4)))))
                })();
            case 'Fm.Term.def':
                var $805 = self.name;
                var $806 = self.expr;
                var $807 = self.body;
                return Fm$Term$serialize$go($807($806))(depth$2)(init$3)(x$4);
            case 'Fm.Term.ann':
                var $808 = self.done;
                var $809 = self.term;
                var $810 = self.type;
                return Fm$Term$serialize$go($809)(depth$2)(init$3)(x$4);
            case 'Fm.Term.gol':
                var $811 = self.name;
                var $812 = self.dref;
                var $813 = self.verb;
                return (() => {
                    var name$8 = a1 => (a1 + (fm_name_to_bits($811)));
                    return Bits$0(Bits$0(Bits$0(name$8(x$4))))
                })();
            case 'Fm.Term.hol':
                var $814 = self.path;
                return x$4;
            case 'Fm.Term.nat':
                var $815 = self.natx;
                return x$4;
            case 'Fm.Term.chr':
                var $816 = self.chrx;
                return x$4;
            case 'Fm.Term.str':
                var $817 = self.strx;
                return x$4;
            case 'Fm.Term.sug':
                var $818 = self.sugx;
                return x$4;
        }
    })()))));
    var Fm$Term$serialize = (term$1 => (depth$2 => Fm$Term$serialize$go(term$1)(depth$2)(depth$2)(Bits$nil)));
    var Bool$or = a0 => a1 => (a0 || a1);
    var Bits$eql = a$1 => b$2 => {
        var Bits$eql = a$1 => b$2 => ({
            ctr: 'TCO',
            arg: [a$1, b$2]
        });
        var arg = [a$1, b$2];
        while (true) {
            let [a$1, b$2] = arg;
            var R = (() => {
                var self = a$1;
                switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                    case 'nil':
                        return (() => {
                            var self = b$2;
                            switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                case 'nil':
                                    return Bool$true;
                                case '0':
                                    var $819 = self.slice(0, -1);
                                    return Bool$false;
                                case '1':
                                    var $820 = self.slice(0, -1);
                                    return Bool$false;
                            }
                        })();
                    case '0':
                        var $821 = self.slice(0, -1);
                        return (() => {
                            var self = b$2;
                            switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                case 'nil':
                                    return Bool$false;
                                case '0':
                                    var $822 = self.slice(0, -1);
                                    return Bits$eql($821)($822);
                                case '1':
                                    var $823 = self.slice(0, -1);
                                    return Bool$false;
                            }
                        })();
                    case '1':
                        var $824 = self.slice(0, -1);
                        return (() => {
                            var self = b$2;
                            switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                case 'nil':
                                    return Bool$false;
                                case '0':
                                    var $825 = self.slice(0, -1);
                                    return Bool$false;
                                case '1':
                                    var $826 = self.slice(0, -1);
                                    return Bits$eql($824)($826);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Set$has = (bits$1 => (set$2 => (() => {
        var self = Map$get(bits$1)(set$2);
        switch (self._) {
            case 'Maybe.none':
                return Bool$false;
            case 'Maybe.some':
                var $827 = self.value;
                return Bool$true;
        }
    })()));
    var Fm$Term$normalize = (term$1 => (defs$2 => (() => {
        var self = Fm$Term$reduce(term$1)(defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $828 = self.name;
                var $829 = self.indx;
                return Fm$Term$var($828)($829);
            case 'Fm.Term.ref':
                var $830 = self.name;
                return Fm$Term$ref($830);
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $831 = self.eras;
                var $832 = self.self;
                var $833 = self.name;
                var $834 = self.xtyp;
                var $835 = self.body;
                return Fm$Term$all($831)($832)($833)(Fm$Term$normalize($834)(defs$2))((s$8 => (x$9 => Fm$Term$normalize($835(s$8)(x$9))(defs$2))));
            case 'Fm.Term.lam':
                var $836 = self.name;
                var $837 = self.body;
                return Fm$Term$lam($836)((x$5 => Fm$Term$normalize($837(x$5))(defs$2)));
            case 'Fm.Term.app':
                var $838 = self.func;
                var $839 = self.argm;
                return Fm$Term$app(Fm$Term$normalize($838)(defs$2))(Fm$Term$normalize($839)(defs$2));
            case 'Fm.Term.let':
                var $840 = self.name;
                var $841 = self.expr;
                var $842 = self.body;
                return Fm$Term$let($840)(Fm$Term$normalize($841)(defs$2))((x$6 => Fm$Term$normalize($842(x$6))(defs$2)));
            case 'Fm.Term.def':
                var $843 = self.name;
                var $844 = self.expr;
                var $845 = self.body;
                return Fm$Term$def($843)(Fm$Term$normalize($844)(defs$2))((x$6 => Fm$Term$normalize($845(x$6))(defs$2)));
            case 'Fm.Term.ann':
                var $846 = self.done;
                var $847 = self.term;
                var $848 = self.type;
                return Fm$Term$ann($846)(Fm$Term$normalize($847)(defs$2))(Fm$Term$normalize($848)(defs$2));
            case 'Fm.Term.gol':
                var $849 = self.name;
                var $850 = self.dref;
                var $851 = self.verb;
                return Fm$Term$gol($849)($850)($851);
            case 'Fm.Term.hol':
                var $852 = self.path;
                return Fm$Term$hol($852);
            case 'Fm.Term.nat':
                var $853 = self.natx;
                return Fm$Term$nat($853);
            case 'Fm.Term.chr':
                var $854 = self.chrx;
                return Fm$Term$chr($854);
            case 'Fm.Term.str':
                var $855 = self.strx;
                return Fm$Term$str($855);
            case 'Fm.Term.sug':
                var $856 = self.sugx;
                return term$1;
        }
    })()));
    var Fm$Term$equal$patch = (path$1 => (term$2 => Fm$Check$result(Maybe$some(Bool$true))(List$cons(Fm$Error$patch(path$1)(Fm$Term$normalize(term$2)(Map$new)))(List$nil))));
    var Set$set = (bits$1 => (set$2 => Map$set(bits$1)(Unit$new)(set$2)));
    var Fm$Term$equal = (a$1 => (b$2 => (defs$3 => (lv$4 => (seen$5 => (() => {
        var a1$6 = Fm$Term$reduce(a$1)(defs$3);
        var b1$7 = Fm$Term$reduce(b$2)(defs$3);
        var ah$8 = Fm$Term$serialize(a1$6)(lv$4);
        var bh$9 = Fm$Term$serialize(b1$7)(lv$4);
        var id$10 = (bh$9 + ah$8);
        return (() => {
            var self = (Bits$eql(ah$8)(bh$9) || Set$has(id$10)(seen$5));
            switch (self ? 'true' : 'false') {
                case 'true':
                    return Fm$Check$result(Maybe$some(Bool$true))(List$nil);
                case 'false':
                    return (() => {
                        var self = a1$6;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $857 = self.name;
                                var $858 = self.indx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $859 = self.name;
                                            var $860 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $861 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $862 = self.eras;
                                            var $863 = self.self;
                                            var $864 = self.name;
                                            var $865 = self.xtyp;
                                            var $866 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $867 = self.name;
                                            var $868 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $869 = self.func;
                                            var $870 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $871 = self.name;
                                            var $872 = self.expr;
                                            var $873 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $874 = self.name;
                                            var $875 = self.expr;
                                            var $876 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $877 = self.done;
                                            var $878 = self.term;
                                            var $879 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $880 = self.name;
                                            var $881 = self.dref;
                                            var $882 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $883 = self.path;
                                            return Fm$Term$equal$patch($883)(a$1);
                                        case 'Fm.Term.nat':
                                            var $884 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $885 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $886 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $887 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ref':
                                var $888 = self.name;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $889 = self.name;
                                            var $890 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $891 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $892 = self.eras;
                                            var $893 = self.self;
                                            var $894 = self.name;
                                            var $895 = self.xtyp;
                                            var $896 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $897 = self.name;
                                            var $898 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $899 = self.func;
                                            var $900 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $901 = self.name;
                                            var $902 = self.expr;
                                            var $903 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $904 = self.name;
                                            var $905 = self.expr;
                                            var $906 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $907 = self.done;
                                            var $908 = self.term;
                                            var $909 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $910 = self.name;
                                            var $911 = self.dref;
                                            var $912 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $913 = self.path;
                                            return Fm$Term$equal$patch($913)(a$1);
                                        case 'Fm.Term.nat':
                                            var $914 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $915 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $916 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $917 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.typ':
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $918 = self.name;
                                            var $919 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $920 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $921 = self.eras;
                                            var $922 = self.self;
                                            var $923 = self.name;
                                            var $924 = self.xtyp;
                                            var $925 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $926 = self.name;
                                            var $927 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $928 = self.func;
                                            var $929 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $930 = self.name;
                                            var $931 = self.expr;
                                            var $932 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $933 = self.name;
                                            var $934 = self.expr;
                                            var $935 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $936 = self.done;
                                            var $937 = self.term;
                                            var $938 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $939 = self.name;
                                            var $940 = self.dref;
                                            var $941 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $942 = self.path;
                                            return Fm$Term$equal$patch($942)(a$1);
                                        case 'Fm.Term.nat':
                                            var $943 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $944 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $945 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $946 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.all':
                                var $947 = self.eras;
                                var $948 = self.self;
                                var $949 = self.name;
                                var $950 = self.xtyp;
                                var $951 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $952 = self.name;
                                            var $953 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $954 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $955 = self.eras;
                                            var $956 = self.self;
                                            var $957 = self.name;
                                            var $958 = self.xtyp;
                                            var $959 = self.body;
                                            return (() => {
                                                var seen$21 = Set$set(id$10)(seen$5);
                                                var a1_body$22 = $951(Fm$Term$var($948)(lv$4))(Fm$Term$var($949)(Nat$succ(lv$4)));
                                                var b1_body$23 = $959(Fm$Term$var($956)(lv$4))(Fm$Term$var($957)(Nat$succ(lv$4)));
                                                var eq_self$24 = ($948 === $956);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($950)($958)(defs$3)(lv$4)(seen$21))((eq_type$25 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$22)(b1_body$23)(defs$3)(Nat$succ(Nat$succ(lv$4)))(seen$21))((eq_body$26 => Monad$pure(Fm$Check$monad)((eq_self$24 && (eq_type$25 && eq_body$26)))))))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $960 = self.name;
                                            var $961 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $962 = self.func;
                                            var $963 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $964 = self.name;
                                            var $965 = self.expr;
                                            var $966 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $967 = self.name;
                                            var $968 = self.expr;
                                            var $969 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $970 = self.done;
                                            var $971 = self.term;
                                            var $972 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $973 = self.name;
                                            var $974 = self.dref;
                                            var $975 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $976 = self.path;
                                            return Fm$Term$equal$patch($976)(a$1);
                                        case 'Fm.Term.nat':
                                            var $977 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $978 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $979 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $980 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.lam':
                                var $981 = self.name;
                                var $982 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $983 = self.name;
                                            var $984 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $985 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $986 = self.eras;
                                            var $987 = self.self;
                                            var $988 = self.name;
                                            var $989 = self.xtyp;
                                            var $990 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $991 = self.name;
                                            var $992 = self.body;
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                var a1_body$16 = $982(Fm$Term$var($981)(lv$4));
                                                var b1_body$17 = $992(Fm$Term$var($991)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$16)(b1_body$17)(defs$3)(Nat$succ(lv$4))(seen$15))((eq_body$18 => Monad$pure(Fm$Check$monad)(eq_body$18)))
                                            })();
                                        case 'Fm.Term.app':
                                            var $993 = self.func;
                                            var $994 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $995 = self.name;
                                            var $996 = self.expr;
                                            var $997 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $998 = self.name;
                                            var $999 = self.expr;
                                            var $1000 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1001 = self.done;
                                            var $1002 = self.term;
                                            var $1003 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1004 = self.name;
                                            var $1005 = self.dref;
                                            var $1006 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1007 = self.path;
                                            return Fm$Term$equal$patch($1007)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1008 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1009 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1010 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1011 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.app':
                                var $1012 = self.func;
                                var $1013 = self.argm;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1014 = self.name;
                                            var $1015 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1016 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1017 = self.eras;
                                            var $1018 = self.self;
                                            var $1019 = self.name;
                                            var $1020 = self.xtyp;
                                            var $1021 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1022 = self.name;
                                            var $1023 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1024 = self.func;
                                            var $1025 = self.argm;
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1012)($1024)(defs$3)(lv$4)(seen$15))((eq_func$16 => Monad$bind(Fm$Check$monad)(Fm$Term$equal($1013)($1025)(defs$3)(lv$4)(seen$15))((eq_argm$17 => Monad$pure(Fm$Check$monad)((eq_func$16 && eq_argm$17))))))
                                            })();
                                        case 'Fm.Term.let':
                                            var $1026 = self.name;
                                            var $1027 = self.expr;
                                            var $1028 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1029 = self.name;
                                            var $1030 = self.expr;
                                            var $1031 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1032 = self.done;
                                            var $1033 = self.term;
                                            var $1034 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1035 = self.name;
                                            var $1036 = self.dref;
                                            var $1037 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1038 = self.path;
                                            return Fm$Term$equal$patch($1038)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1039 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1040 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1041 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1042 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.let':
                                var $1043 = self.name;
                                var $1044 = self.expr;
                                var $1045 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1046 = self.name;
                                            var $1047 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1048 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1049 = self.eras;
                                            var $1050 = self.self;
                                            var $1051 = self.name;
                                            var $1052 = self.xtyp;
                                            var $1053 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1054 = self.name;
                                            var $1055 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1056 = self.func;
                                            var $1057 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1058 = self.name;
                                            var $1059 = self.expr;
                                            var $1060 = self.body;
                                            return (() => {
                                                var seen$17 = Set$set(id$10)(seen$5);
                                                var a1_body$18 = $1045(Fm$Term$var($1043)(lv$4));
                                                var b1_body$19 = $1060(Fm$Term$var($1058)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1044)($1059)(defs$3)(lv$4)(seen$17))((eq_expr$20 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$18)(b1_body$19)(defs$3)(Nat$succ(lv$4))(seen$17))((eq_body$21 => Monad$pure(Fm$Check$monad)((eq_expr$20 && eq_body$21))))))
                                            })();
                                        case 'Fm.Term.def':
                                            var $1061 = self.name;
                                            var $1062 = self.expr;
                                            var $1063 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1064 = self.done;
                                            var $1065 = self.term;
                                            var $1066 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1067 = self.name;
                                            var $1068 = self.dref;
                                            var $1069 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1070 = self.path;
                                            return Fm$Term$equal$patch($1070)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1071 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1072 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1073 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1074 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.def':
                                var $1075 = self.name;
                                var $1076 = self.expr;
                                var $1077 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1078 = self.name;
                                            var $1079 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1080 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1081 = self.eras;
                                            var $1082 = self.self;
                                            var $1083 = self.name;
                                            var $1084 = self.xtyp;
                                            var $1085 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1086 = self.name;
                                            var $1087 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1088 = self.func;
                                            var $1089 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1090 = self.name;
                                            var $1091 = self.expr;
                                            var $1092 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1093 = self.name;
                                            var $1094 = self.expr;
                                            var $1095 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1096 = self.done;
                                            var $1097 = self.term;
                                            var $1098 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1099 = self.name;
                                            var $1100 = self.dref;
                                            var $1101 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1102 = self.path;
                                            return Fm$Term$equal$patch($1102)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1103 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1104 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1105 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1106 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ann':
                                var $1107 = self.done;
                                var $1108 = self.term;
                                var $1109 = self.type;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1110 = self.name;
                                            var $1111 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1112 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1113 = self.eras;
                                            var $1114 = self.self;
                                            var $1115 = self.name;
                                            var $1116 = self.xtyp;
                                            var $1117 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1118 = self.name;
                                            var $1119 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1120 = self.func;
                                            var $1121 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1122 = self.name;
                                            var $1123 = self.expr;
                                            var $1124 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1125 = self.name;
                                            var $1126 = self.expr;
                                            var $1127 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1128 = self.done;
                                            var $1129 = self.term;
                                            var $1130 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1131 = self.name;
                                            var $1132 = self.dref;
                                            var $1133 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1134 = self.path;
                                            return Fm$Term$equal$patch($1134)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1135 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1136 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1137 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1138 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.gol':
                                var $1139 = self.name;
                                var $1140 = self.dref;
                                var $1141 = self.verb;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1142 = self.name;
                                            var $1143 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1144 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1145 = self.eras;
                                            var $1146 = self.self;
                                            var $1147 = self.name;
                                            var $1148 = self.xtyp;
                                            var $1149 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1150 = self.name;
                                            var $1151 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1152 = self.func;
                                            var $1153 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1154 = self.name;
                                            var $1155 = self.expr;
                                            var $1156 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1157 = self.name;
                                            var $1158 = self.expr;
                                            var $1159 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1160 = self.done;
                                            var $1161 = self.term;
                                            var $1162 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1163 = self.name;
                                            var $1164 = self.dref;
                                            var $1165 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1166 = self.path;
                                            return Fm$Term$equal$patch($1166)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1167 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1168 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1169 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1170 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.hol':
                                var $1171 = self.path;
                                return Fm$Term$equal$patch($1171)(b$2);
                            case 'Fm.Term.nat':
                                var $1172 = self.natx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1173 = self.name;
                                            var $1174 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1175 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1176 = self.eras;
                                            var $1177 = self.self;
                                            var $1178 = self.name;
                                            var $1179 = self.xtyp;
                                            var $1180 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1181 = self.name;
                                            var $1182 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1183 = self.func;
                                            var $1184 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1185 = self.name;
                                            var $1186 = self.expr;
                                            var $1187 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1188 = self.name;
                                            var $1189 = self.expr;
                                            var $1190 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1191 = self.done;
                                            var $1192 = self.term;
                                            var $1193 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1194 = self.name;
                                            var $1195 = self.dref;
                                            var $1196 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1197 = self.path;
                                            return Fm$Term$equal$patch($1197)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1198 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1199 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1200 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1201 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.chr':
                                var $1202 = self.chrx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1203 = self.name;
                                            var $1204 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1205 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1206 = self.eras;
                                            var $1207 = self.self;
                                            var $1208 = self.name;
                                            var $1209 = self.xtyp;
                                            var $1210 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1211 = self.name;
                                            var $1212 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1213 = self.func;
                                            var $1214 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1215 = self.name;
                                            var $1216 = self.expr;
                                            var $1217 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1218 = self.name;
                                            var $1219 = self.expr;
                                            var $1220 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1221 = self.done;
                                            var $1222 = self.term;
                                            var $1223 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1224 = self.name;
                                            var $1225 = self.dref;
                                            var $1226 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1227 = self.path;
                                            return Fm$Term$equal$patch($1227)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1228 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1229 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1230 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1231 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.str':
                                var $1232 = self.strx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1233 = self.name;
                                            var $1234 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1235 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1236 = self.eras;
                                            var $1237 = self.self;
                                            var $1238 = self.name;
                                            var $1239 = self.xtyp;
                                            var $1240 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1241 = self.name;
                                            var $1242 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1243 = self.func;
                                            var $1244 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1245 = self.name;
                                            var $1246 = self.expr;
                                            var $1247 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1248 = self.name;
                                            var $1249 = self.expr;
                                            var $1250 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1251 = self.done;
                                            var $1252 = self.term;
                                            var $1253 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1254 = self.name;
                                            var $1255 = self.dref;
                                            var $1256 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1257 = self.path;
                                            return Fm$Term$equal$patch($1257)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1258 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1259 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1260 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1261 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.sug':
                                var $1262 = self.sugx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1263 = self.name;
                                            var $1264 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1265 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1266 = self.eras;
                                            var $1267 = self.self;
                                            var $1268 = self.name;
                                            var $1269 = self.xtyp;
                                            var $1270 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1271 = self.name;
                                            var $1272 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1273 = self.func;
                                            var $1274 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1275 = self.name;
                                            var $1276 = self.expr;
                                            var $1277 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1278 = self.name;
                                            var $1279 = self.expr;
                                            var $1280 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1281 = self.done;
                                            var $1282 = self.term;
                                            var $1283 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1284 = self.name;
                                            var $1285 = self.dref;
                                            var $1286 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1287 = self.path;
                                            return Fm$Term$equal$patch($1287)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1288 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1289 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1290 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1291 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                        }
                    })();
            }
        })()
    })())))));
    var Set$new = Map$new;
    var Fm$Term$check = (term$1 => (type$2 => (defs$3 => (ctx$4 => (path$5 => Monad$bind(Fm$Check$monad)((() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1292 = self.name;
                var $1293 = self.indx;
                return (() => {
                    var self = List$at_last($1293)(ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$undefined_reference($1292))(List$nil));
                        case 'Maybe.some':
                            var $1294 = self.value;
                            return Fm$Check$result(Maybe$some(Pair$snd($1294)))(List$nil);
                    }
                })();
            case 'Fm.Term.ref':
                var $1295 = self.name;
                return (() => {
                    var self = Fm$get($1295)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$undefined_reference($1295))(List$nil));
                        case 'Maybe.some':
                            var $1296 = self.value;
                            return (() => {
                                var self = $1296;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1297 = self.name;
                                        var $1298 = self.term;
                                        var $1299 = self.type;
                                        var $1300 = self.done;
                                        return Fm$Check$result(Maybe$some($1299))(List$nil);
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return Fm$Check$result(Maybe$some(Fm$Term$typ))(List$nil);
            case 'Fm.Term.all':
                var $1301 = self.eras;
                var $1302 = self.self;
                var $1303 = self.name;
                var $1304 = self.xtyp;
                var $1305 = self.body;
                return (() => {
                    var ctx_size$11 = List$length(ctx$4);
                    var self_var$12 = Fm$Term$var($1302)(ctx_size$11);
                    var body_var$13 = Fm$Term$var($1303)(Nat$succ(ctx_size$11));
                    var body_ctx$14 = List$cons(Pair$new($1303)($1304))(List$cons(Pair$new($1302)(term$1))(ctx$4));
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1304)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($15 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1305(self_var$12)(body_var$13))(Maybe$some(Fm$Term$typ))(defs$3)(body_ctx$14)(Fm$MPath$1(path$5)))(($16 => Monad$pure(Fm$Check$monad)(Fm$Term$typ)))))
                })();
            case 'Fm.Term.lam':
                var $1306 = self.name;
                var $1307 = self.body;
                return (() => {
                    var self = type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                        case 'Maybe.some':
                            var $1308 = self.value;
                            return (() => {
                                var typv$9 = Fm$Term$reduce($1308)(defs$3);
                                return (() => {
                                    var self = typv$9;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1309 = self.name;
                                            var $1310 = self.indx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.ref':
                                            var $1311 = self.name;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.typ':
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.all':
                                            var $1312 = self.eras;
                                            var $1313 = self.self;
                                            var $1314 = self.name;
                                            var $1315 = self.xtyp;
                                            var $1316 = self.body;
                                            return (() => {
                                                var ctx_size$15 = List$length(ctx$4);
                                                var self_var$16 = term$1;
                                                var body_var$17 = Fm$Term$var($1306)(ctx_size$15);
                                                var body_typ$18 = $1316(self_var$16)(body_var$17);
                                                var body_ctx$19 = List$cons(Pair$new($1306)($1315))(ctx$4);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1307(body_var$17))(Maybe$some(body_typ$18))(defs$3)(body_ctx$19)(Fm$MPath$0(path$5)))(($20 => Monad$pure(Fm$Check$monad)($1308)))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $1317 = self.name;
                                            var $1318 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.app':
                                            var $1319 = self.func;
                                            var $1320 = self.argm;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.let':
                                            var $1321 = self.name;
                                            var $1322 = self.expr;
                                            var $1323 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.def':
                                            var $1324 = self.name;
                                            var $1325 = self.expr;
                                            var $1326 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.ann':
                                            var $1327 = self.done;
                                            var $1328 = self.term;
                                            var $1329 = self.type;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.gol':
                                            var $1330 = self.name;
                                            var $1331 = self.dref;
                                            var $1332 = self.verb;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.hol':
                                            var $1333 = self.path;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.nat':
                                            var $1334 = self.natx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.chr':
                                            var $1335 = self.chrx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.str':
                                            var $1336 = self.strx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                        case 'Fm.Term.sug':
                                            var $1337 = self.sugx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1308))(ctx$4))(List$nil));
                                    }
                                })()
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $1338 = self.func;
                var $1339 = self.argm;
                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1338)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((func_typ$8 => (() => {
                    var func_typ$9 = Fm$Term$reduce(func_typ$8)(defs$3);
                    return (() => {
                        var self = func_typ$9;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $1340 = self.name;
                                var $1341 = self.indx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.ref':
                                var $1342 = self.name;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.typ':
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.all':
                                var $1343 = self.eras;
                                var $1344 = self.self;
                                var $1345 = self.name;
                                var $1346 = self.xtyp;
                                var $1347 = self.body;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1339)(Maybe$some($1346))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($15 => Monad$pure(Fm$Check$monad)($1347($1338)($1339))));
                            case 'Fm.Term.lam':
                                var $1348 = self.name;
                                var $1349 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.app':
                                var $1350 = self.func;
                                var $1351 = self.argm;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.let':
                                var $1352 = self.name;
                                var $1353 = self.expr;
                                var $1354 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.def':
                                var $1355 = self.name;
                                var $1356 = self.expr;
                                var $1357 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.ann':
                                var $1358 = self.done;
                                var $1359 = self.term;
                                var $1360 = self.type;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.gol':
                                var $1361 = self.name;
                                var $1362 = self.dref;
                                var $1363 = self.verb;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.hol':
                                var $1364 = self.path;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.nat':
                                var $1365 = self.natx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.chr':
                                var $1366 = self.chrx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.str':
                                var $1367 = self.strx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.sug':
                                var $1368 = self.sugx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                        }
                    })()
                })()));
            case 'Fm.Term.let':
                var $1369 = self.name;
                var $1370 = self.expr;
                var $1371 = self.body;
                return (() => {
                    var ctx_size$9 = List$length(ctx$4);
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1370)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((expr_typ$10 => (() => {
                        var body_val$11 = $1371(Fm$Term$var($1369)(ctx_size$9));
                        var body_ctx$12 = List$cons(Pair$new($1369)(expr_typ$10))(ctx$4);
                        return Monad$bind(Fm$Check$monad)(Fm$Term$check(body_val$11)(type$2)(defs$3)(body_ctx$12)(Fm$MPath$1(path$5)))((body_typ$13 => Monad$pure(Fm$Check$monad)(body_typ$13)))
                    })()))
                })();
            case 'Fm.Term.def':
                var $1372 = self.name;
                var $1373 = self.expr;
                var $1374 = self.body;
                return Fm$Term$check($1374($1373))(type$2)(defs$3)(ctx$4)(path$5);
            case 'Fm.Term.ann':
                var $1375 = self.done;
                var $1376 = self.term;
                var $1377 = self.type;
                return (() => {
                    var self = $1375;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1377);
                        case 'false':
                            return Monad$bind(Fm$Check$monad)(Fm$Term$check($1376)(Maybe$some($1377))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($9 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1377)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($10 => Monad$pure(Fm$Check$monad)($1377)))));
                    }
                })();
            case 'Fm.Term.gol':
                var $1378 = self.name;
                var $1379 = self.dref;
                var $1380 = self.verb;
                return Fm$Check$result(type$2)(List$cons(Fm$Error$show_goal($1378)($1379)($1380)(type$2)(ctx$4))(List$nil));
            case 'Fm.Term.hol':
                var $1381 = self.path;
                return Fm$Check$result(type$2)(List$nil);
            case 'Fm.Term.nat':
                var $1382 = self.natx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Nat"));
            case 'Fm.Term.chr':
                var $1383 = self.chrx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Char"));
            case 'Fm.Term.str':
                var $1384 = self.strx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("String"));
            case 'Fm.Term.sug':
                var $1385 = self.sugx;
                return (() => {
                    var self = $1385;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $1386 = self.func;
                            var $1387 = self.args;
                            return (() => {
                                var expr$9 = $1386;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check(expr$9)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((etyp$10 => (() => {
                                    var dsug$11 = Fm$Term$desugar_app($1386)($1387)(etyp$10)(defs$3);
                                    return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$patch(Fm$MPath$to_bits(path$5))(dsug$11))(List$nil))
                                })()))
                            })();
                        case 'Fm.Sugar.cse':
                            var $1388 = self.expr;
                            var $1389 = self.name;
                            var $1390 = self.with;
                            var $1391 = self.cses;
                            var $1392 = self.moti;
                            return (() => {
                                var expr$12 = $1388;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check(expr$12)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((etyp$13 => (() => {
                                    var dsug$14 = Fm$Term$desugar_cse($1388)($1389)($1390)($1391)($1392)(etyp$13)(defs$3)(ctx$4);
                                    return (() => {
                                        var self = dsug$14;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                                            case 'Maybe.some':
                                                var $1393 = self.value;
                                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$patch(Fm$MPath$to_bits(path$5))($1393))(List$nil));
                                        }
                                    })()
                                })()))
                            })();
                    }
                })();
        }
    })())((infr$6 => (() => {
        var self = type$2;
        switch (self._) {
            case 'Maybe.none':
                return Fm$Check$result(Maybe$some(infr$6))(List$nil);
            case 'Maybe.some':
                var $1394 = self.value;
                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1394)(infr$6)(defs$3)(List$length(ctx$4))(Set$new))((eqls$8 => (() => {
                    var self = eqls$8;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1394);
                        case 'false':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$right($1394))(Either$right(infr$6))(ctx$4))(List$nil));
                    }
                })()));
        }
    })())))))));
    var Fm$Path$nil = (x$1 => x$1);
    var Fm$MPath$nil = Maybe$some(Fm$Path$nil);
    var Fm$Term$patch_at = (path$1 => (term$2 => (fn$3 => (() => {
        var self = term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $1395 = self.name;
                var $1396 = self.indx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1397 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1398 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.ref':
                var $1399 = self.name;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1400 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1401 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.typ':
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1402 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1403 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.all':
                var $1404 = self.eras;
                var $1405 = self.self;
                var $1406 = self.name;
                var $1407 = self.xtyp;
                var $1408 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1409 = self.slice(0, -1);
                            return Fm$Term$all($1404)($1405)($1406)(Fm$Term$patch_at($1409)($1407)(fn$3))($1408);
                        case '1':
                            var $1410 = self.slice(0, -1);
                            return Fm$Term$all($1404)($1405)($1406)($1407)((s$10 => (x$11 => Fm$Term$patch_at($1410)($1408(s$10)(x$11))(fn$3))));
                    }
                })();
            case 'Fm.Term.lam':
                var $1411 = self.name;
                var $1412 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1413 = self.slice(0, -1);
                            return Fm$Term$lam($1411)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1412(x$7))(fn$3)));
                        case '1':
                            var $1414 = self.slice(0, -1);
                            return Fm$Term$lam($1411)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1412(x$7))(fn$3)));
                    }
                })();
            case 'Fm.Term.app':
                var $1415 = self.func;
                var $1416 = self.argm;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1417 = self.slice(0, -1);
                            return Fm$Term$app(Fm$Term$patch_at($1417)($1415)(fn$3))($1416);
                        case '1':
                            var $1418 = self.slice(0, -1);
                            return Fm$Term$app($1415)(Fm$Term$patch_at($1418)($1416)(fn$3));
                    }
                })();
            case 'Fm.Term.let':
                var $1419 = self.name;
                var $1420 = self.expr;
                var $1421 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1422 = self.slice(0, -1);
                            return Fm$Term$let($1419)(Fm$Term$patch_at($1422)($1420)(fn$3))($1421);
                        case '1':
                            var $1423 = self.slice(0, -1);
                            return Fm$Term$let($1419)($1420)((x$8 => Fm$Term$patch_at($1423)($1421(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.def':
                var $1424 = self.name;
                var $1425 = self.expr;
                var $1426 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1427 = self.slice(0, -1);
                            return Fm$Term$def($1424)(Fm$Term$patch_at($1427)($1425)(fn$3))($1426);
                        case '1':
                            var $1428 = self.slice(0, -1);
                            return Fm$Term$def($1424)($1425)((x$8 => Fm$Term$patch_at($1428)($1426(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.ann':
                var $1429 = self.done;
                var $1430 = self.term;
                var $1431 = self.type;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1432 = self.slice(0, -1);
                            return Fm$Term$ann($1429)(Fm$Term$patch_at(path$1)($1430)(fn$3))($1431);
                        case '1':
                            var $1433 = self.slice(0, -1);
                            return Fm$Term$ann($1429)(Fm$Term$patch_at(path$1)($1430)(fn$3))($1431);
                    }
                })();
            case 'Fm.Term.gol':
                var $1434 = self.name;
                var $1435 = self.dref;
                var $1436 = self.verb;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1437 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1438 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.hol':
                var $1439 = self.path;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1440 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1441 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.nat':
                var $1442 = self.natx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1443 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1444 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.chr':
                var $1445 = self.chrx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1446 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1447 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.str':
                var $1448 = self.strx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1449 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1450 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.sug':
                var $1451 = self.sugx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1452 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1453 = self.slice(0, -1);
                            return term$2;
                    }
                })();
        }
    })())));
    var Fm$synth$fix = term$1 => type$2 => defs$3 => errs$4 => fixs$5 => {
        var Fm$synth$fix = term$1 => type$2 => defs$3 => errs$4 => fixs$5 => ({
            ctr: 'TCO',
            arg: [term$1, type$2, defs$3, errs$4, fixs$5]
        });
        var arg = [term$1, type$2, defs$3, errs$4, fixs$5];
        while (true) {
            let [term$1, type$2, defs$3, errs$4, fixs$5] = arg;
            var R = (() => {
                var self = errs$4;
                switch (self._) {
                    case 'List.nil':
                        return (() => {
                            var self = fixs$5;
                            switch (self ? 'true' : 'false') {
                                case 'true':
                                    return Maybe$some(Pair$new(term$1)(type$2));
                                case 'false':
                                    return Maybe$none;
                            }
                        })();
                    case 'List.cons':
                        var $1454 = self.head;
                        var $1455 = self.tail;
                        return (() => {
                            var self = $1454;
                            switch (self._) {
                                case 'Fm.Error.type_mismatch':
                                    var $1456 = self.expected;
                                    var $1457 = self.detected;
                                    var $1458 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1455)(fixs$5);
                                case 'Fm.Error.show_goal':
                                    var $1459 = self.name;
                                    var $1460 = self.dref;
                                    var $1461 = self.verb;
                                    var $1462 = self.goal;
                                    var $1463 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1455)(fixs$5);
                                case 'Fm.Error.patch':
                                    var $1464 = self.path;
                                    var $1465 = self.term;
                                    return (() => {
                                        var self = $1464;
                                        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                            case 'nil':
                                                return Maybe$none;
                                            case '0':
                                                var $1466 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_term$11 = Fm$Term$patch_at($1466)(term$1)((x$11 => $1465));
                                                    return Fm$synth$fix(patched_term$11)(type$2)(defs$3)($1455)(Bool$true)
                                                })();
                                            case '1':
                                                var $1467 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_type$11 = Fm$Term$patch_at($1467)(type$2)((x$11 => $1465));
                                                    return Fm$synth$fix(term$1)(patched_type$11)(defs$3)($1455)(Bool$true)
                                                })();
                                        }
                                    })();
                                case 'Fm.Error.undefined_reference':
                                    var $1468 = self.name;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1455)(fixs$5);
                                case 'Fm.Error.cant_infer':
                                    var $1469 = self.term;
                                    var $1470 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1455)(fixs$5);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Fm$synth$one = (name$1 => (term$2 => (type$3 => (defs$4 => ((console.log(String$flatten(List$cons("synth ")(List$cons(name$1)(List$nil)))), (x$5 => (() => {
        var checked$6 = Monad$bind(Fm$Check$monad)(Fm$Term$check(type$3)(Maybe$some(Fm$Term$typ))(defs$4)(List$nil)(Fm$MPath$1(Fm$MPath$nil)))((chk_type$6 => Monad$bind(Fm$Check$monad)(Fm$Term$check(term$2)(Maybe$some(type$3))(defs$4)(List$nil)(Fm$MPath$0(Fm$MPath$nil)))((chk_term$7 => Monad$pure(Fm$Check$monad)(Unit$new)))));
        return (() => {
            var self = checked$6;
            switch (self._) {
                case 'Fm.Check.result':
                    var $1471 = self.value;
                    var $1472 = self.errors;
                    return (() => {
                        var self = $1472;
                        switch (self._) {
                            case 'List.nil':
                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                            case 'List.cons':
                                var $1473 = self.head;
                                var $1474 = self.tail;
                                return (() => {
                                    var fixed$11 = Fm$synth$fix(term$2)(type$3)(defs$4)($1472)(Bool$false);
                                    return (() => {
                                        var self = fixed$11;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                                            case 'Maybe.some':
                                                var $1475 = self.value;
                                                return (() => {
                                                    var self = $1475;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $1476 = self.fst;
                                                            var $1477 = self.snd;
                                                            return (() => {
                                                                var term$15 = Fm$Term$bind(List$nil)(Fm$Path$0(Fm$Path$nil))($1476);
                                                                var type$16 = Fm$Term$bind(List$nil)(Fm$Path$1(Fm$Path$nil))($1477);
                                                                return Fm$synth$one(name$1)(term$15)(type$16)(defs$4)
                                                            })();
                                                    }
                                                })();
                                        }
                                    })()
                                })();
                        }
                    })();
            }
        })()
    })())()))))));
    var Fm$synth = (defs$1 => (() => {
        var defs$2 = (list_for(Map$to_list(defs$1))(defs$1)((def$2 => (defs$3 => (() => {
            var self = def$2;
            switch (self._) {
                case 'Pair.new':
                    var $1478 = self.fst;
                    var $1479 = self.snd;
                    return (() => {
                        var self = $1479;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $1480 = self.name;
                                var $1481 = self.term;
                                var $1482 = self.type;
                                var $1483 = self.done;
                                return (() => {
                                    var name$10 = Fm$Name$from_bits($1478);
                                    var term$11 = $1481;
                                    var type$12 = $1482;
                                    var done$13 = $1483;
                                    var defn$14 = Fm$synth$one(name$10)(term$11)(type$12)(defs$3);
                                    return Fm$set(name$10)(defn$14)(defs$3)
                                })();
                        }
                    })();
            }
        })()))));
        return defs$2
    })());
    var Fm$Name$show = (name$1 => name$1);
    var Either = (A$1 => (B$2 => null));
    var Nat$sub_rem = n$1 => m$2 => {
        var Nat$sub_rem = n$1 => m$2 => ({
            ctr: 'TCO',
            arg: [n$1, m$2]
        });
        var arg = [n$1, m$2];
        while (true) {
            let [n$1, m$2] = arg;
            var R = (() => {
                var self = m$2;
                switch (self === 0n ? 'zero' : 'succ') {
                    case 'zero':
                        return Either$left(n$1);
                    case 'succ':
                        var $1484 = (self - 1n);
                        return (() => {
                            var self = n$1;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Either$right(Nat$succ($1484));
                                case 'succ':
                                    var $1485 = (self - 1n);
                                    return Nat$sub_rem($1485)($1484);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$div_mod$go = n$1 => m$2 => d$3 => {
        var Nat$div_mod$go = n$1 => m$2 => d$3 => ({
            ctr: 'TCO',
            arg: [n$1, m$2, d$3]
        });
        var arg = [n$1, m$2, d$3];
        while (true) {
            let [n$1, m$2, d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem(n$1)(m$2);
                switch (self._) {
                    case 'Either.left':
                        var $1486 = self.value;
                        return Nat$div_mod$go($1486)(m$2)(Nat$succ(d$3));
                    case 'Either.right':
                        var $1487 = self.value;
                        return Pair$new(d$3)(n$1);
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));
    var Nat$to_base$go = base$1 => nat$2 => res$3 => {
        var Nat$to_base$go = base$1 => nat$2 => res$3 => ({
            ctr: 'TCO',
            arg: [base$1, nat$2, res$3]
        });
        var arg = [base$1, nat$2, res$3];
        while (true) {
            let [base$1, nat$2, res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': nat$2 / base$1,
                    'snd': nat$2 % base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $1488 = self.fst;
                        var $1489 = self.snd;
                        return (() => {
                            var self = $1488;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return List$cons($1489)(res$3);
                                case 'succ':
                                    var $1490 = (self - 1n);
                                    return Nat$to_base$go(base$1)($1488)(List$cons($1489)(res$3));
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$to_base = (base$1 => (nat$2 => Nat$to_base$go(base$1)(nat$2)(List$nil)));
    var Nat$mod = (n$1 => (m$2 => Pair$snd((({
        _: 'Pair.new',
        'fst': n$1 / m$2,
        'snd': n$1 % m$2
    })))));
    var Cmp$as_gtn = (cmp$1 => (() => {
        var self = cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                return Bool$false;
            case 'Cmp.eql':
                return Bool$false;
            case 'Cmp.gtn':
                return Bool$true;
        }
    })());
    var Nat$gtn = a0 => a1 => (a0 > a1);
    var Nat$lte = a0 => a1 => (a0 <= a1);
    var Nat$show_digit = (base$1 => (n$2 => (() => {
        var m$3 = Nat$mod(n$2)(base$1);
        var base64$4 = List$cons(48)(List$cons(49)(List$cons(50)(List$cons(51)(List$cons(52)(List$cons(53)(List$cons(54)(List$cons(55)(List$cons(56)(List$cons(57)(List$cons(65)(List$cons(66)(List$cons(67)(List$cons(68)(List$cons(69)(List$cons(70)(List$cons(71)(List$cons(72)(List$cons(73)(List$cons(74)(List$cons(75)(List$cons(76)(List$cons(77)(List$cons(78)(List$cons(79)(List$cons(80)(List$cons(81)(List$cons(82)(List$cons(83)(List$cons(84)(List$cons(85)(List$cons(86)(List$cons(87)(List$cons(88)(List$cons(89)(List$cons(90)(List$cons(97)(List$cons(98)(List$cons(99)(List$cons(100)(List$cons(101)(List$cons(102)(List$cons(103)(List$cons(104)(List$cons(105)(List$cons(106)(List$cons(107)(List$cons(108)(List$cons(109)(List$cons(110)(List$cons(111)(List$cons(112)(List$cons(113)(List$cons(114)(List$cons(115)(List$cons(116)(List$cons(117)(List$cons(118)(List$cons(119)(List$cons(120)(List$cons(121)(List$cons(122)(List$cons(43)(List$cons(47)(List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        return (() => {
            var self = ((base$1 > 0n) && (base$1 <= 64n));
            switch (self ? 'true' : 'false') {
                case 'true':
                    return (() => {
                        var self = List$at(m$3)(base64$4);
                        switch (self._) {
                            case 'Maybe.none':
                                return 35;
                            case 'Maybe.some':
                                var $1491 = self.value;
                                return $1491;
                        }
                    })();
                case 'false':
                    return 35;
            }
        })()
    })()));
    var Nat$to_string_base = (base$1 => (nat$2 => List$fold(Nat$to_base(base$1)(nat$2))(String$nil)((n$3 => (str$4 => String$cons(Nat$show_digit(base$1)(n$3))(str$4))))));
    var Nat$show = (n$1 => Nat$to_string_base(10n)(n$1));
    var Bits$to_nat = (b$1 => (() => {
        var self = b$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return 0n;
            case '0':
                var $1492 = self.slice(0, -1);
                return (2n * Bits$to_nat($1492));
            case '1':
                var $1493 = self.slice(0, -1);
                return Nat$succ((2n * Bits$to_nat($1493)));
        }
    })());
    var String$join$go = (sep$1 => (list$2 => (fst$3 => (() => {
        var self = list$2;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1494 = self.head;
                var $1495 = self.tail;
                return String$flatten(List$cons((() => {
                    var self = fst$3;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return "";
                        case 'false':
                            return sep$1;
                    }
                })())(List$cons($1494)(List$cons(String$join$go(sep$1)($1495)(Bool$false))(List$nil))));
        }
    })())));
    var String$join = (sep$1 => (list$2 => String$join$go(sep$1)(list$2)(Bool$true)));
    var Pair$fst = (pair$3 => (() => {
        var self = pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1496 = self.fst;
                var $1497 = self.snd;
                return $1496;
        }
    })());
    var Fm$Term$show$go = (term$1 => (path$2 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1498 = self.name;
                var $1499 = self.indx;
                return Fm$Name$show($1498);
            case 'Fm.Term.ref':
                var $1500 = self.name;
                return (() => {
                    var name$4 = Fm$Name$show($1500);
                    return (() => {
                        var self = path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                return name$4;
                            case 'Maybe.some':
                                var $1501 = self.value;
                                return (() => {
                                    var path_val$6 = (Bits$1(Bits$nil) + Fm$Path$to_bits($1501));
                                    var path_str$7 = Nat$show(Bits$to_nat(path_val$6));
                                    return String$flatten(List$cons(name$4)(List$cons("\u{1b}[2m-")(List$cons(path_str$7)(List$cons("\u{1b}[0m")(List$nil)))))
                                })();
                        }
                    })()
                })();
            case 'Fm.Term.typ':
                return "Type";
            case 'Fm.Term.all':
                var $1502 = self.eras;
                var $1503 = self.self;
                var $1504 = self.name;
                var $1505 = self.xtyp;
                var $1506 = self.body;
                return (() => {
                    var eras$8 = $1502;
                    var self$9 = Fm$Name$show($1503);
                    var name$10 = Fm$Name$show($1504);
                    var type$11 = Fm$Term$show$go($1505)(Fm$MPath$0(path$2));
                    var open$12 = (() => {
                        var self = eras$8;
                        switch (self ? 'true' : 'false') {
                            case 'true':
                                return "<";
                            case 'false':
                                return "(";
                        }
                    })();
                    var clos$13 = (() => {
                        var self = eras$8;
                        switch (self ? 'true' : 'false') {
                            case 'true':
                                return ">";
                            case 'false':
                                return ")";
                        }
                    })();
                    var body$14 = Fm$Term$show$go($1506(Fm$Term$var($1503)(0n))(Fm$Term$var($1504)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons(self$9)(List$cons(open$12)(List$cons(name$10)(List$cons(":")(List$cons(type$11)(List$cons(clos$13)(List$cons(" ")(List$cons(body$14)(List$nil)))))))))
                })();
            case 'Fm.Term.lam':
                var $1507 = self.name;
                var $1508 = self.body;
                return (() => {
                    var name$5 = Fm$Name$show($1507);
                    var body$6 = Fm$Term$show$go($1508(Fm$Term$var($1507)(0n)))(Fm$MPath$0(path$2));
                    return String$flatten(List$cons("(")(List$cons(name$5)(List$cons(") ")(List$cons(body$6)(List$nil)))))
                })();
            case 'Fm.Term.app':
                var $1509 = self.func;
                var $1510 = self.argm;
                return (() => {
                    var func$5 = Fm$Term$show$go($1509)(Fm$MPath$0(path$2));
                    var argm$6 = Fm$Term$show$go($1510)(Fm$MPath$1(path$2));
                    var wrap$7 = (() => {
                        var self = func$5;
                        switch (self.length === 0 ? 'nil' : 'cons') {
                            case 'nil':
                                return Bool$false;
                            case 'cons':
                                var $1511 = self.charCodeAt(0);
                                var $1512 = self.slice(1);
                                return ($1511 === 40);
                        }
                    })();
                    return (() => {
                        var self = wrap$7;
                        switch (self ? 'true' : 'false') {
                            case 'true':
                                return String$flatten(List$cons("(")(List$cons(func$5)(List$cons(")")(List$cons("(")(List$cons(argm$6)(List$cons(")")(List$nil)))))));
                            case 'false':
                                return String$flatten(List$cons(func$5)(List$cons("(")(List$cons(argm$6)(List$cons(")")(List$nil)))));
                        }
                    })()
                })();
            case 'Fm.Term.let':
                var $1513 = self.name;
                var $1514 = self.expr;
                var $1515 = self.body;
                return (() => {
                    var name$6 = Fm$Name$show($1513);
                    var expr$7 = Fm$Term$show$go($1514)(Fm$MPath$0(path$2));
                    var body$8 = Fm$Term$show$go($1515(Fm$Term$var($1513)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons("let ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                })();
            case 'Fm.Term.def':
                var $1516 = self.name;
                var $1517 = self.expr;
                var $1518 = self.body;
                return (() => {
                    var name$6 = Fm$Name$show($1516);
                    var expr$7 = Fm$Term$show$go($1517)(Fm$MPath$0(path$2));
                    var body$8 = Fm$Term$show$go($1518(Fm$Term$var($1516)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons("def ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                })();
            case 'Fm.Term.ann':
                var $1519 = self.done;
                var $1520 = self.term;
                var $1521 = self.type;
                return (() => {
                    var term$6 = Fm$Term$show$go($1520)(Fm$MPath$0(path$2));
                    var type$7 = Fm$Term$show$go($1521)(Fm$MPath$1(path$2));
                    return String$flatten(List$cons(term$6)(List$cons("::")(List$cons(type$7)(List$nil))))
                })();
            case 'Fm.Term.gol':
                var $1522 = self.name;
                var $1523 = self.dref;
                var $1524 = self.verb;
                return (() => {
                    var name$6 = Fm$Name$show($1522);
                    return String$flatten(List$cons("?")(List$cons(name$6)(List$nil)))
                })();
            case 'Fm.Term.hol':
                var $1525 = self.path;
                return "_";
            case 'Fm.Term.nat':
                var $1526 = self.natx;
                return String$flatten(List$cons(Nat$show($1526))(List$nil));
            case 'Fm.Term.chr':
                var $1527 = self.chrx;
                return String$cons($1527)(String$nil);
            case 'Fm.Term.str':
                var $1528 = self.strx;
                return String$flatten(List$cons("\"")(List$cons($1528)(List$cons("\"")(List$nil))));
            case 'Fm.Term.sug':
                var $1529 = self.sugx;
                return (() => {
                    var self = $1529;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $1530 = self.func;
                            var $1531 = self.args;
                            return (() => {
                                var func$6 = Fm$Term$show$go($1530)(Fm$MPath$0(path$2));
                                var args$7 = Map$to_list($1531);
                                var args$8 = List$mapped(args$7)((x$8 => (() => {
                                    var self = x$8;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $1532 = self.fst;
                                            var $1533 = self.snd;
                                            return String$flatten(List$cons(Fm$Name$show(Fm$Name$from_bits($1532)))(List$cons(": ")(List$cons(Fm$Term$show$go($1533)(Maybe$none))(List$nil))));
                                    }
                                })()));
                                var args$9 = String$join(", ")(args$8);
                                var wrap$10 = (() => {
                                    var self = func$6;
                                    switch (self.length === 0 ? 'nil' : 'cons') {
                                        case 'nil':
                                            return Bool$false;
                                        case 'cons':
                                            var $1534 = self.charCodeAt(0);
                                            var $1535 = self.slice(1);
                                            return ($1534 === 40);
                                    }
                                })();
                                return (() => {
                                    var self = wrap$10;
                                    switch (self ? 'true' : 'false') {
                                        case 'true':
                                            return String$flatten(List$cons("(")(List$cons(func$6)(List$cons(")")(List$cons("(")(List$cons(args$9)(List$cons(")")(List$nil)))))));
                                        case 'false':
                                            return String$flatten(List$cons(func$6)(List$cons("(")(List$cons(args$9)(List$cons(")")(List$nil)))));
                                    }
                                })()
                            })();
                        case 'Fm.Sugar.cse':
                            var $1536 = self.expr;
                            var $1537 = self.name;
                            var $1538 = self.with;
                            var $1539 = self.cses;
                            var $1540 = self.moti;
                            return (() => {
                                var expr$9 = Fm$Term$show$go($1536)(Fm$MPath$0(path$2));
                                var name$10 = Fm$Name$show($1537);
                                var with$11 = String$join("")(List$mapped($1538)((def$11 => (() => {
                                    var self = def$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1541 = self.name;
                                            var $1542 = self.term;
                                            var $1543 = self.type;
                                            var $1544 = self.done;
                                            return (() => {
                                                var name$16 = Fm$Name$show($1541);
                                                var type$17 = Fm$Term$show$go($1543)(Maybe$none);
                                                var term$18 = Fm$Term$show$go($1542)(Maybe$none);
                                                return String$flatten(List$cons(name$16)(List$cons(": ")(List$cons(type$17)(List$cons(" = ")(List$cons(term$18)(List$cons(";")(List$nil)))))))
                                            })();
                                    }
                                })())));
                                var cses$12 = Map$to_list($1539);
                                var cses$13 = String$join("")(List$mapped(cses$12)((x$13 => (() => {
                                    var name$14 = Fm$Name$show(Fm$Name$from_bits(Pair$fst(x$13)));
                                    var term$15 = Fm$Term$show$go(Pair$snd(x$13))(Maybe$none);
                                    return String$flatten(List$cons(name$14)(List$cons(": ")(List$cons(term$15)(List$cons("; ")(List$nil)))))
                                })())));
                                var moti$14 = Fm$Term$show$go($1540)(Maybe$none);
                                return String$flatten(List$cons("case ")(List$cons(expr$9)(List$cons(" as ")(List$cons(name$10)(List$cons(with$11)(List$cons(" { ")(List$cons(cses$13)(List$cons("} : ")(List$cons(moti$14)(List$nil))))))))))
                            })();
                    }
                })();
        }
    })()));
    var Fm$Term$show = (term$1 => Fm$Term$show$go(term$1)(Maybe$none));
    var String$is_empty = (str$1 => (() => {
        var self = str$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Bool$true;
            case 'cons':
                var $1545 = self.charCodeAt(0);
                var $1546 = self.slice(1);
                return Bool$false;
        }
    })());
    var Fm$Context$show = (context$1 => (() => {
        var self = context$1;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1547 = self.head;
                var $1548 = self.tail;
                return (() => {
                    var self = $1547;
                    switch (self._) {
                        case 'Pair.new':
                            var $1549 = self.fst;
                            var $1550 = self.snd;
                            return (() => {
                                var name$6 = Fm$Name$show($1549);
                                var type$7 = Fm$Term$show($1550);
                                var rest$8 = Fm$Context$show($1548);
                                return String$flatten(List$cons(rest$8)(List$cons((() => {
                                    var self = String$is_empty(rest$8);
                                    switch (self ? 'true' : 'false') {
                                        case 'true':
                                            return "";
                                        case 'false':
                                            return "\u{a}";
                                    }
                                })())(List$cons("- ")(List$cons(name$6)(List$cons(": ")(List$cons(type$7)(List$nil)))))))
                            })();
                    }
                })();
        }
    })());
    var Fm$Term$expand_at = (path$1 => (term$2 => (defs$3 => Fm$Term$patch_at(path$1)(term$2)((term$4 => (() => {
        var self = term$4;
        switch (self._) {
            case 'Fm.Term.var':
                var $1551 = self.name;
                var $1552 = self.indx;
                return term$4;
            case 'Fm.Term.ref':
                var $1553 = self.name;
                return (() => {
                    var self = Fm$get($1553)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($1553);
                        case 'Maybe.some':
                            var $1554 = self.value;
                            return (() => {
                                var self = $1554;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1555 = self.name;
                                        var $1556 = self.term;
                                        var $1557 = self.type;
                                        var $1558 = self.done;
                                        return $1556;
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$4;
            case 'Fm.Term.all':
                var $1559 = self.eras;
                var $1560 = self.self;
                var $1561 = self.name;
                var $1562 = self.xtyp;
                var $1563 = self.body;
                return term$4;
            case 'Fm.Term.lam':
                var $1564 = self.name;
                var $1565 = self.body;
                return term$4;
            case 'Fm.Term.app':
                var $1566 = self.func;
                var $1567 = self.argm;
                return term$4;
            case 'Fm.Term.let':
                var $1568 = self.name;
                var $1569 = self.expr;
                var $1570 = self.body;
                return term$4;
            case 'Fm.Term.def':
                var $1571 = self.name;
                var $1572 = self.expr;
                var $1573 = self.body;
                return term$4;
            case 'Fm.Term.ann':
                var $1574 = self.done;
                var $1575 = self.term;
                var $1576 = self.type;
                return term$4;
            case 'Fm.Term.gol':
                var $1577 = self.name;
                var $1578 = self.dref;
                var $1579 = self.verb;
                return term$4;
            case 'Fm.Term.hol':
                var $1580 = self.path;
                return term$4;
            case 'Fm.Term.nat':
                var $1581 = self.natx;
                return term$4;
            case 'Fm.Term.chr':
                var $1582 = self.chrx;
                return term$4;
            case 'Fm.Term.str':
                var $1583 = self.strx;
                return term$4;
            case 'Fm.Term.sug':
                var $1584 = self.sugx;
                return term$4;
        }
    })())))));
    var Fm$Term$expand = (dref$1 => (term$2 => (defs$3 => (() => {
        var term$4 = Fm$Term$normalize(term$2)(Map$new);
        var term$5 = (list_for(dref$1)(term$4)((path$5 => (term$6 => Fm$Term$normalize(Fm$Term$expand_at(path$5)(term$6)(defs$3))(Map$new)))));
        return term$5
    })())));
    var Fm$Error$show = (error$1 => (defs$2 => (() => {
        var self = error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $1585 = self.expected;
                var $1586 = self.detected;
                var $1587 = self.context;
                return (() => {
                    var expected$6 = (() => {
                        var self = $1585;
                        switch (self._) {
                            case 'Either.left':
                                var $1588 = self.value;
                                return $1588;
                            case 'Either.right':
                                var $1589 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1589)(Map$new));
                        }
                    })();
                    var detected$7 = (() => {
                        var self = $1586;
                        switch (self._) {
                            case 'Either.left':
                                var $1590 = self.value;
                                return $1590;
                            case 'Either.right':
                                var $1591 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1591)(Map$new));
                        }
                    })();
                    var context$8 = Fm$Context$show($1587);
                    return String$flatten(List$cons("Type mismatch.\u{a}")(List$cons("- Expected: ")(List$cons(expected$6)(List$cons("\u{a}")(List$cons("- Detected: ")(List$cons(detected$7)(List$cons("\u{a}")(List$cons("With context:\u{a}")(List$cons(context$8)(List$nil))))))))))
                })();
            case 'Fm.Error.show_goal':
                var $1592 = self.name;
                var $1593 = self.dref;
                var $1594 = self.verb;
                var $1595 = self.goal;
                var $1596 = self.context;
                return (() => {
                    var goal_name$8 = String$flatten(List$cons("Goal ?")(List$cons(Fm$Name$show($1592))(List$cons(":\u{a}")(List$nil))));
                    var with_type$9 = (() => {
                        var self = $1595;
                        switch (self._) {
                            case 'Maybe.none':
                                return "";
                            case 'Maybe.some':
                                var $1597 = self.value;
                                return (() => {
                                    var goal$10 = Fm$Term$expand($1593)($1597)(defs$2);
                                    return String$flatten(List$cons("With type: ")(List$cons((() => {
                                        var self = $1594;
                                        switch (self ? 'true' : 'false') {
                                            case 'true':
                                                return Fm$Term$show$go(goal$10)(Maybe$some((x$11 => x$11)));
                                            case 'false':
                                                return Fm$Term$show(goal$10);
                                        }
                                    })())(List$cons("\u{a}")(List$nil))))
                                })();
                        }
                    })();
                    var with_ctxt$10 = String$flatten(List$cons("With ctxt:\u{a}")(List$cons(Fm$Context$show($1596))(List$nil)));
                    return String$flatten(List$cons(goal_name$8)(List$cons(with_type$9)(List$cons(with_ctxt$10)(List$nil))))
                })();
            case 'Fm.Error.patch':
                var $1598 = self.path;
                var $1599 = self.term;
                return String$flatten(List$cons("Patching: ")(List$cons(Fm$Term$show($1599))(List$nil)));
            case 'Fm.Error.undefined_reference':
                var $1600 = self.name;
                return String$flatten(List$cons("Undefined reference: ")(List$cons(Fm$Name$show($1600))(List$nil)));
            case 'Fm.Error.cant_infer':
                var $1601 = self.term;
                var $1602 = self.context;
                return (() => {
                    var term$5 = Fm$Term$show($1601);
                    var context$6 = Fm$Context$show($1602);
                    return String$flatten(List$cons("Can\'t infer type of: ")(List$cons(term$5)(List$cons("\u{a}")(List$cons("With ctxt:\u{a}")(List$cons(context$6)(List$nil))))))
                })();
        }
    })()));
    var Fm$report = (defs$1 => (() => {
        var state$2 = Pair$new("")("");
        var state$3 = (list_for(Map$to_list(defs$1))(state$2)((def$3 => (state$4 => (() => {
            var self = state$4;
            switch (self._) {
                case 'Pair.new':
                    var $1603 = self.fst;
                    var $1604 = self.snd;
                    return (() => {
                        var self = def$3;
                        switch (self._) {
                            case 'Pair.new':
                                var $1605 = self.fst;
                                var $1606 = self.snd;
                                return (() => {
                                    var self = $1606;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1607 = self.name;
                                            var $1608 = self.term;
                                            var $1609 = self.type;
                                            var $1610 = self.done;
                                            return (() => {
                                                var name$13 = Fm$Name$from_bits($1605);
                                                var term$14 = $1608;
                                                var type$15 = $1609;
                                                var check$16 = Fm$Term$check(term$14)(Maybe$some(type$15))(defs$1)(List$nil)(Fm$MPath$nil);
                                                return (() => {
                                                    var self = check$16;
                                                    switch (self._) {
                                                        case 'Fm.Check.result':
                                                            var $1611 = self.value;
                                                            var $1612 = self.errors;
                                                            return (() => {
                                                                var self = $1612;
                                                                switch (self._) {
                                                                    case 'List.nil':
                                                                        return (() => {
                                                                            var name_str$19 = Fm$Name$show(name$13);
                                                                            var type_str$20 = Fm$Term$show(type$15);
                                                                            var term_str$21 = Fm$Term$show(term$14);
                                                                            var string_0$22 = String$flatten(List$cons($1603)(List$cons(name_str$19)(List$cons(": ")(List$cons(type_str$20)(List$cons("\u{a}")(List$nil))))));
                                                                            var string_1$23 = $1604;
                                                                            return Pair$new(string_0$22)(string_1$23)
                                                                        })();
                                                                    case 'List.cons':
                                                                        var $1613 = self.head;
                                                                        var $1614 = self.tail;
                                                                        return (() => {
                                                                            var name_str$21 = Fm$Name$show(name$13);
                                                                            var type_str$22 = "<error>";
                                                                            var string_0$23 = String$flatten(List$cons($1603)(List$cons(name_str$21)(List$cons(": ")(List$cons(type_str$22)(List$cons("\u{a}")(List$nil))))));
                                                                            var string_1$24 = $1604;
                                                                            var string_1$25 = (list_for($1612)(string_1$24)((error$25 => (string_1$26 => String$flatten(List$cons(string_1$26)(List$cons(Fm$Error$show(error$25)(defs$1))(List$cons("\u{a}")(List$nil))))))));
                                                                            return Pair$new(string_0$23)(string_1$25)
                                                                        })();
                                                                }
                                                            })();
                                                    }
                                                })()
                                            })();
                                    }
                                })();
                        }
                    })();
            }
        })()))));
        return (() => {
            var self = state$3;
            switch (self._) {
                case 'Pair.new':
                    var $1615 = self.fst;
                    var $1616 = self.snd;
                    return String$flatten(List$cons("\u{a}# Types:\u{a}\u{a}")(List$cons($1615)(List$cons("\u{a}")(List$cons((() => {
                        var self = $1616;
                        switch (self.length === 0 ? 'nil' : 'cons') {
                            case 'nil':
                                return "";
                            case 'cons':
                                var $1617 = self.charCodeAt(0);
                                var $1618 = self.slice(1);
                                return String$flatten(List$cons("# Errors:\u{a}\u{a}")(List$cons($1616)(List$nil)));
                        }
                    })())(List$nil)))));
            }
        })()
    })());
    var IO$print = (text$1 => IO$ask("print")(text$1)((skip$2 => IO$end(Unit$new))));
    var main = Monad$bind(IO$monad)(IO$get_args)((name$1 => Monad$bind(IO$monad)(IO$get_file(name$1))((file$2 => (() => {
        var defs$3 = Maybe$default(Map$new)(Fm$Defs$read(file$2));
        var defs$4 = Fm$synth(defs$3);
        var report$5 = Fm$report(defs$4);
        return IO$print(report$5)
    })()))));
    return {
        '$main$': () => run(main),
        'Monad.bind': Monad$bind,
        'IO': IO,
        'Monad.new': Monad$new,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.get_args': IO$get_args,
        'IO.get_file': IO$get_file,
        'Maybe.default': Maybe$default,
        'Map': Map,
        'Map.new': Map$new,
        'Parser': Parser,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.bind': Parser$bind,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.pure': Parser$pure,
        'Parser.monad': Parser$monad,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'Parser.maybe': Parser$maybe,
        'List': List,
        'List.nil': List$nil,
        'List.cons': List$cons,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.first_of': Parser$first_of,
        'Unit.new': Unit$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.char_if': Parser$char_if,
        'Bool.not': Bool$not,
        'Fm.Parser.spaces': Fm$Parser$spaces,
        'Bool.and': Bool$and,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.btw': U16$btw,
        'Fm.Name.is_letter': Fm$Name$is_letter,
        'Fm.Parser.letter': Fm$Parser$letter,
        'Monad.pure': Monad$pure,
        'List.fold': List$fold,
        'Fm.Parser.name': Fm$Parser$name,
        'Parser.many1': Parser$many1,
        'Fm.Parser.spaces_text': Fm$Parser$spaces_text,
        'Pair': Pair,
        'Fm.Parser.item': Fm$Parser$item,
        'Fm.Term.typ': Fm$Term$typ,
        'Fm.Parser.type': Fm$Parser$type,
        'Parser.spaces': Parser$spaces,
        'Parser.spaces_text': Parser$spaces_text,
        'Fm.Term.all': Fm$Term$all,
        'Fm.Parser.forall': Fm$Parser$forall,
        'Fm.Parser.name1': Fm$Parser$name1,
        'Fm.Term.lam': Fm$Term$lam,
        'Fm.Parser.make_lambda': Fm$Parser$make_lambda,
        'Fm.Parser.lambda': Fm$Parser$lambda,
        'Fm.Parser.parenthesis': Fm$Parser$parenthesis,
        'Fm.Term.ref': Fm$Term$ref,
        'Fm.Term.app': Fm$Term$app,
        'Fm.Term.hol': Fm$Term$hol,
        'Bits.nil': Bits$nil,
        'Fm.Term.let': Fm$Term$let,
        'Fm.Parser.letforin': Fm$Parser$letforin,
        'Fm.Parser.let': Fm$Parser$let,
        'Fm.Term.def': Fm$Term$def,
        'Fm.Parser.def': Fm$Parser$def,
        'Fm.Parser.if': Fm$Parser$if,
        'Pair.new': Pair$new,
        'List.mapped': List$mapped,
        'Parser.one': Parser$one,
        'Fm.Parser.char.single': Fm$Parser$char$single,
        'Fm.Term.chr': Fm$Term$chr,
        'Fm.Parser.char': Fm$Parser$char,
        'Parser.if_not': Parser$if_not,
        'Parser.until': Parser$until,
        'Fm.Term.str': Fm$Term$str,
        'Fm.Parser.string': Fm$Parser$string,
        'Fm.Parser.pair': Fm$Parser$pair,
        'Fm.Name.read': Fm$Name$read,
        'Fm.Parser.list': Fm$Parser$list,
        'Fm.Parser.forin': Fm$Parser$forin,
        'Fm.Parser.do.statements': Fm$Parser$do$statements,
        'Fm.Parser.do': Fm$Parser$do,
        'Fm.Def.new': Fm$Def$new,
        'Fm.Parser.case.with': Fm$Parser$case$with,
        'Fm.Parser.case.case': Fm$Parser$case$case,
        'Map.tie': Map$tie,
        'Map.set': Map$set,
        'Map.from_list': Map$from_list,
        'U16.new': U16$new,
        'Word.nil': Word$nil,
        'Word': Word,
        'Nat.succ': Nat$succ,
        'Word.1': Word$1,
        'Word.0': Word$0,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U16.sub': U16$sub,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'U16.inc': U16$inc,
        'Word.zero': Word$zero,
        'U16.zero': U16$zero,
        'Nat.to_u16': Nat$to_u16,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U16.add': U16$add,
        'Bits.0': Bits$0,
        'Bits.1': Bits$1,
        'Word.to_bits': Word$to_bits,
        'Nat.zero': Nat$zero,
        'Word.trim': Word$trim,
        'Bits.concat': Bits$concat,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'Fm.Name.to_bits': Fm$Name$to_bits,
        'Fm.Sugar.cse': Fm$Sugar$cse,
        'Fm.Term.sug': Fm$Term$sug,
        'Fm.Parser.case': Fm$Parser$case,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Bits.tail': Bits$tail,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'Maybe.to_bool': Maybe$to_bool,
        'Fm.Term.gol': Fm$Term$gol,
        'Fm.Parser.goal': Fm$Parser$goal,
        'Fm.Parser.hole': Fm$Parser$hole,
        'Fm.Term.nat': Fm$Term$nat,
        'Fm.Parser.nat': Fm$Parser$nat,
        'Fm.Parser.reference': Fm$Parser$reference,
        'Fm.Sugar.app': Fm$Sugar$app,
        'Fm.Parser.sugar.application': Fm$Parser$sugar$application,
        'List.for': List$for,
        'Fm.Parser.application': Fm$Parser$application,
        'Fm.Parser.arrow': Fm$Parser$arrow,
        'Fm.Term.ann': Fm$Term$ann,
        'Fm.Parser.annotation': Fm$Parser$annotation,
        'Fm.Parser.suffix': Fm$Parser$suffix,
        'Fm.Parser.term': Fm$Parser$term,
        'Fm.Parser.name_term': Fm$Parser$name_term,
        'Fm.Binder.new': Fm$Binder$new,
        'Fm.Parser.binder.homo': Fm$Parser$binder$homo,
        'List.concat': List$concat,
        'List.flatten': List$flatten,
        'Fm.Parser.binder': Fm$Parser$binder,
        'Fm.Parser.make_forall': Fm$Parser$make_forall,
        'List.at': List$at,
        'List.at_last': List$at_last,
        'Fm.Term.var': Fm$Term$var,
        'Pair.snd': Pair$snd,
        'String.eql': String$eql,
        'Fm.Name.eql': Fm$Name$eql,
        'Fm.Context.find': Fm$Context$find,
        'List.length.go': List$length$go,
        'List.length': List$length,
        'Fm.Path.0': Fm$Path$0,
        'Fm.Path.1': Fm$Path$1,
        'Fm.Path.to_bits': Fm$Path$to_bits,
        'Fm.Term.bind': Fm$Term$bind,
        'Debug.log': Debug$log,
        'Fm.Parser.definition': Fm$Parser$definition,
        'Fm.Constructor.new': Fm$Constructor$new,
        'Fm.Parser.constructor': Fm$Parser$constructor,
        'Fm.Datatype.new': Fm$Datatype$new,
        'Fm.Parser.datatype': Fm$Parser$datatype,
        'Fm.Datatype.build_term.motive.go': Fm$Datatype$build_term$motive$go,
        'Fm.Datatype.build_term.motive': Fm$Datatype$build_term$motive,
        'Fm.Datatype.build_term.constructor.go': Fm$Datatype$build_term$constructor$go,
        'Fm.Datatype.build_term.constructor': Fm$Datatype$build_term$constructor,
        'Fm.Datatype.build_term.constructors.go': Fm$Datatype$build_term$constructors$go,
        'Fm.Datatype.build_term.constructors': Fm$Datatype$build_term$constructors,
        'Fm.Datatype.build_term.go': Fm$Datatype$build_term$go,
        'Fm.Datatype.build_term': Fm$Datatype$build_term,
        'Fm.Datatype.build_type.go': Fm$Datatype$build_type$go,
        'Fm.Datatype.build_type': Fm$Datatype$build_type,
        'Fm.set': Fm$set,
        'Fm.Constructor.build_term.opt.go': Fm$Constructor$build_term$opt$go,
        'Fm.Constructor.build_term.opt': Fm$Constructor$build_term$opt,
        'Fm.Constructor.build_term.go': Fm$Constructor$build_term$go,
        'Fm.Constructor.build_term': Fm$Constructor$build_term,
        'Fm.Constructor.build_type.go': Fm$Constructor$build_type$go,
        'Fm.Constructor.build_type': Fm$Constructor$build_type,
        'Fm.Parser.file.go': Fm$Parser$file$go,
        'Fm.Parser.file': Fm$Parser$file,
        'Fm.Defs.read': Fm$Defs$read,
        'Map.to_list.go': Map$to_list$go,
        'Map.to_list': Map$to_list,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Word.from_bits': Word$from_bits,
        'Fm.Name.from_bits': Fm$Name$from_bits,
        'Fm.Check': Fm$Check,
        'Fm.Check.result': Fm$Check$result,
        'Fm.Check.bind': Fm$Check$bind,
        'Fm.Check.pure': Fm$Check$pure,
        'Fm.Check.monad': Fm$Check$monad,
        'Fm.Error.undefined_reference': Fm$Error$undefined_reference,
        'Map.get': Map$get,
        'Fm.get': Fm$get,
        'Maybe.mapped': Maybe$mapped,
        'Fm.MPath.0': Fm$MPath$0,
        'Fm.MPath.1': Fm$MPath$1,
        'Fm.Error.cant_infer': Fm$Error$cant_infer,
        'Fm.Term.unroll_nat': Fm$Term$unroll_nat,
        'Fm.Term.unroll_chr.bits': Fm$Term$unroll_chr$bits,
        'Fm.Term.unroll_chr': Fm$Term$unroll_chr,
        'Fm.Term.unroll_str': Fm$Term$unroll_str,
        'Fm.Term.reduce': Fm$Term$reduce,
        'Fm.Error.type_mismatch': Fm$Error$type_mismatch,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Fm.Error.show_goal': Fm$Error$show_goal,
        'Fm.Term.desugar_app': Fm$Term$desugar_app,
        'Fm.Error.patch': Fm$Error$patch,
        'Fm.MPath.to_bits': Fm$MPath$to_bits,
        'Fm.Term.desugar_cse.motive': Fm$Term$desugar_cse$motive,
        'Fm.Term.desugar_cse.argument': Fm$Term$desugar_cse$argument,
        'Maybe.or': Maybe$or,
        'Fm.Term.desugar_cse.cases': Fm$Term$desugar_cse$cases,
        'Fm.Term.desugar_cse': Fm$Term$desugar_cse,
        'Cmp.as_gte': Cmp$as_gte,
        'Nat.cmp': Nat$cmp,
        'Nat.gte': Nat$gte,
        'Nat.pred': Nat$pred,
        'Nat.sub': Nat$sub,
        'Fm.Term.serialize.go': Fm$Term$serialize$go,
        'Fm.Term.serialize': Fm$Term$serialize,
        'Bool.or': Bool$or,
        'Bits.eql': Bits$eql,
        'Set.has': Set$has,
        'Fm.Term.normalize': Fm$Term$normalize,
        'Fm.Term.equal.patch': Fm$Term$equal$patch,
        'Set.set': Set$set,
        'Fm.Term.equal': Fm$Term$equal,
        'Set.new': Set$new,
        'Fm.Term.check': Fm$Term$check,
        'Fm.Path.nil': Fm$Path$nil,
        'Fm.MPath.nil': Fm$MPath$nil,
        'Fm.Term.patch_at': Fm$Term$patch_at,
        'Fm.synth.fix': Fm$synth$fix,
        'Fm.synth.one': Fm$synth$one,
        'Fm.synth': Fm$synth,
        'Fm.Name.show': Fm$Name$show,
        'Either': Either,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.mod': Nat$mod,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Bits.to_nat': Bits$to_nat,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Pair.fst': Pair$fst,
        'Fm.Term.show.go': Fm$Term$show$go,
        'Fm.Term.show': Fm$Term$show,
        'String.is_empty': String$is_empty,
        'Fm.Context.show': Fm$Context$show,
        'Fm.Term.expand_at': Fm$Term$expand_at,
        'Fm.Term.expand': Fm$Term$expand,
        'Fm.Error.show': Fm$Error$show,
        'Fm.report': Fm$report,
        'IO.print': IO$print,
        'main': main,
    };
})();
module.exports['$main$']().then(() => process.exit());