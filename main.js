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
    var Bool$false = false;
    var Bool$true = true;
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
    var Cmp$eql = ({
        _: 'Cmp.eql'
    });
    var Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    var Cmp$gtn = ({
        _: 'Cmp.gtn'
    });
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
                                    var $6 = (self - 1n);
                                    return Cmp$ltn;
                            }
                        })();
                    case 'succ':
                        var $7 = (self - 1n);
                        return (() => {
                            var self = b$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Cmp$gtn;
                                case 'succ':
                                    var $8 = (self - 1n);
                                    return Nat$cmp($7)($8);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$gte = a0 => a1 => (a0 >= a1);
    var String$cons = (head$1 => (tail$2 => (String.fromCharCode(head$1) + tail$2)));
    var String$concat = a0 => a1 => (a0 + a1);
    var List$fold = (list$2 => (nil$4 => (cons$5 => (() => {
        var self = list$2;
        switch (self._) {
            case 'List.nil':
                return nil$4;
            case 'List.cons':
                var $9 = self.head;
                var $10 = self.tail;
                return cons$5($9)(List$fold($10)(nil$4)(cons$5));
        }
    })())));
    var Either = (A$1 => (B$2 => null));
    var Either$left = (value$3 => ({
        _: 'Either.left',
        'value': value$3
    }));
    var Either$right = (value$3 => ({
        _: 'Either.right',
        'value': value$3
    }));
    var Nat$succ = (pred$1 => 1n + pred$1);
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
                        var $11 = (self - 1n);
                        return (() => {
                            var self = n$1;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Either$right(Nat$succ($11));
                                case 'succ':
                                    var $12 = (self - 1n);
                                    return Nat$sub_rem($12)($11);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Pair = (A$1 => (B$2 => null));
    var Pair$new = (fst$3 => (snd$4 => ({
        _: 'Pair.new',
        'fst': fst$3,
        'snd': snd$4
    })));
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
                        var $13 = self.value;
                        return Nat$div_mod$go($13)(m$2)(Nat$succ(d$3));
                    case 'Either.right':
                        var $14 = self.value;
                        return Pair$new(d$3)(n$1);
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Nat$zero = 0n;
    var Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));
    var List = (A$1 => null);
    var List$cons = (head$2 => (tail$3 => ({
        _: 'List.cons',
        'head': head$2,
        'tail': tail$3
    })));
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
                        var $15 = self.fst;
                        var $16 = self.snd;
                        return (() => {
                            var self = $15;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return List$cons($16)(res$3);
                                case 'succ':
                                    var $17 = (self - 1n);
                                    return Nat$to_base$go(base$1)($15)(List$cons($16)(res$3));
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var List$nil = ({
        _: 'List.nil'
    });
    var Nat$to_base = (base$1 => (nat$2 => Nat$to_base$go(base$1)(nat$2)(List$nil)));
    var String$nil = '';
    var Pair$snd = (pair$3 => (() => {
        var self = pair$3;
        switch (self._) {
            case 'Pair.new':
                var $18 = self.fst;
                var $19 = self.snd;
                return $19;
        }
    })());
    var Nat$mod = (n$1 => (m$2 => Pair$snd((({
        _: 'Pair.new',
        'fst': n$1 / m$2,
        'snd': n$1 % m$2
    })))));
    var Bool$and = a0 => a1 => (a0 && a1);
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
    var Nat$lte = a0 => a1 => (a0 <= a1);
    var Maybe = (A$1 => null);
    var Maybe$none = ({
        _: 'Maybe.none'
    });
    var Maybe$some = (value$2 => ({
        _: 'Maybe.some',
        'value': value$2
    }));
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
                        var $20 = self.head;
                        var $21 = self.tail;
                        return (() => {
                            var self = index$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Maybe$some($20);
                                case 'succ':
                                    var $22 = (self - 1n);
                                    return List$at($22)($21);
                            }
                        })();
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
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
                                var $23 = self.value;
                                return $23;
                        }
                    })();
                case 'false':
                    return 35;
            }
        })()
    })()));
    var Nat$to_string_base = (base$1 => (nat$2 => List$fold(Nat$to_base(base$1)(nat$2))(String$nil)((n$3 => (str$4 => String$cons(Nat$show_digit(base$1)(n$3))(str$4))))));
    var Nat$show = (n$1 => Nat$to_string_base(10n)(n$1));
    var Nat$pred = (n$1 => (() => {
        var self = n$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Nat$zero;
            case 'succ':
                var $24 = (self - 1n);
                return $24;
        }
    })());
    var Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);
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
                        var $25 = self.head;
                        var $26 = self.tail;
                        return String$flatten$go($26)((res$2 + $25));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var String$flatten = (xs$1 => String$flatten$go(xs$1)(""));
    var Fm$Term$var = (name$1 => (indx$2 => ({
        _: 'Fm.Term.var',
        'name': name$1,
        'indx': indx$2
    })));
    var Fm$Term$serialize$string = (term$1 => (depth$2 => (init$3 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $27 = self.name;
                var $28 = self.indx;
                return (() => {
                    var self = ($28 >= init$3);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return ("#" + Nat$show(Nat$pred((depth$2 - $28 <= 0n ? 0n : depth$2 - $28))));
                        case 'false':
                            return ("^" + Nat$show($28));
                    }
                })();
            case 'Fm.Term.ref':
                var $29 = self.name;
                return $29;
            case 'Fm.Term.typ':
                return "*";
            case 'Fm.Term.all':
                var $30 = self.eras;
                var $31 = self.self;
                var $32 = self.name;
                var $33 = self.xtyp;
                var $34 = self.body;
                return String$flatten(List$cons("\u{2200}")(List$cons($31)(List$cons(Fm$Term$serialize$string($33)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($34(Fm$Term$var($31)(depth$2))(Fm$Term$var($32)(Nat$succ(depth$2))))(Nat$succ(Nat$succ(depth$2)))(init$3))(List$nil)))));
            case 'Fm.Term.lam':
                var $35 = self.name;
                var $36 = self.body;
                return String$flatten(List$cons("\u{3bb}")(List$cons(Fm$Term$serialize$string($36(Fm$Term$var($35)(depth$2)))(Nat$succ(depth$2))(init$3))(List$nil)));
            case 'Fm.Term.app':
                var $37 = self.func;
                var $38 = self.argm;
                return String$flatten(List$cons("@")(List$cons(Fm$Term$serialize$string($37)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($38)(depth$2)(init$3))(List$nil))));
            case 'Fm.Term.let':
                var $39 = self.name;
                var $40 = self.expr;
                var $41 = self.body;
                return String$flatten(List$cons("$")(List$cons(Fm$Term$serialize$string($40)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($41(Fm$Term$var($39)(depth$2)))(Nat$succ(depth$2))(init$3))(List$nil))));
            case 'Fm.Term.def':
                var $42 = self.name;
                var $43 = self.expr;
                var $44 = self.body;
                return Fm$Term$serialize$string($44($43))(depth$2)(init$3);
            case 'Fm.Term.ann':
                var $45 = self.done;
                var $46 = self.term;
                var $47 = self.type;
                return Fm$Term$serialize$string($46)(depth$2)(init$3);
            case 'Fm.Term.gol':
                var $48 = self.name;
                var $49 = self.dref;
                var $50 = self.verb;
                return String$flatten(List$cons("?")(List$cons($48)(List$nil)));
            case 'Fm.Term.hol':
                var $51 = self.path;
                return "_";
            case 'Fm.Term.nat':
                var $52 = self.natx;
                return "_";
            case 'Fm.Term.chr':
                var $53 = self.chrx;
                return "_";
            case 'Fm.Term.str':
                var $54 = self.strx;
                return "_";
            case 'Fm.Term.sug':
                var $55 = self.sugx;
                return "_";
        }
    })())));
    var Monad$bind = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Monad.new':
                var $56 = self.bind;
                var $57 = self.pure;
                return $56;
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
                var $58 = self.value;
                return f$4($58);
            case 'IO.ask':
                var $59 = self.query;
                var $60 = self.param;
                var $61 = self.then;
                return IO$ask($59)($60)((x$8 => IO$bind($61(x$8))(f$4)));
        }
    })()));
    var IO$end = (value$2 => ({
        _: 'IO.end',
        'value': value$2
    }));
    var IO$monad = Monad$new(IO$bind)(IO$end);
    var IO$get_args = IO$ask("get_args")("")((line$1 => IO$end(line$1)));
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
    var Word$cmp$go = (a$2 => (b$3 => (c$4 => (() => {
        var self = a$2;
        switch (self._) {
            case 'Word.nil':
                return (b$5 => c$4);
            case 'Word.0':
                var $62 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $63 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($63)(c$4));
                        case 'Word.1':
                            var $64 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($64)(Cmp$ltn));
                    }
                })()($62));
            case 'Word.1':
                var $65 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $66 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($66)(Cmp$gtn));
                        case 'Word.1':
                            var $67 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($67)(c$4));
                    }
                })()($65));
        }
    })()(b$3))));
    var Word$cmp = (a$2 => (b$3 => Word$cmp$go(a$2)(b$3)(Cmp$eql)));
    var Word$eql = (a$2 => (b$3 => Cmp$as_eql(Word$cmp(a$2)(b$3))));
    var U16$eql = a0 => a1 => (a0 === a1);
    var String$eql = a0 => a1 => (a0 === a1);
    var IO$get_file = (name$1 => IO$ask("get_file")(name$1)((file$2 => IO$end(file$2))));
    var Maybe$default = (a$2 => (m$3 => (() => {
        var self = m$3;
        switch (self._) {
            case 'Maybe.none':
                return a$2;
            case 'Maybe.some':
                var $68 = self.value;
                return $68;
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
                var $69 = self.code;
                var $70 = self.err;
                return Parser$Reply$error($69)($70);
            case 'Parser.Reply.value':
                var $71 = self.code;
                var $72 = self.val;
                return next$4($72)($71);
        }
    })())));
    var Parser$Reply$value = (code$2 => (val$3 => ({
        _: 'Parser.Reply.value',
        'code': code$2,
        'val': val$3
    })));
    var Parser$pure = (value$2 => (code$3 => Parser$Reply$value(code$3)(value$2)));
    var Parser$monad = Monad$new(Parser$bind)(Parser$pure);
    var Parser$maybe = (parse$2 => (code$3 => (() => {
        var self = parse$2(code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $73 = self.code;
                var $74 = self.err;
                return Parser$Reply$value(code$3)(Maybe$none);
            case 'Parser.Reply.value':
                var $75 = self.code;
                var $76 = self.val;
                return Parser$Reply$value($75)(Maybe$some($76));
        }
    })()));
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
                        var $77 = self.code;
                        var $78 = self.err;
                        return Parser$Reply$value(code$4)(values$3(List$nil));
                    case 'Parser.Reply.value':
                        var $79 = self.code;
                        var $80 = self.val;
                        return Parser$many$go(parse$2)((xs$7 => values$3(List$cons($80)(xs$7))))($79);
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
                        var $81 = self.head;
                        var $82 = self.tail;
                        return (() => {
                            var parsed$6 = $81(code$3);
                            return (() => {
                                var self = parsed$6;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $83 = self.code;
                                        var $84 = self.err;
                                        return Parser$first_of($82)(code$3);
                                    case 'Parser.Reply.value':
                                        var $85 = self.code;
                                        var $86 = self.val;
                                        return Parser$Reply$value($85)($86);
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
    var Parser$text$go = (text$1 => (code$2 => (() => {
        var self = text$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$value(code$2)(Unit$new);
            case 'cons':
                var $87 = self.charCodeAt(0);
                var $88 = self.slice(1);
                return (() => {
                    var self = code$2;
                    switch (self.length === 0 ? 'nil' : 'cons') {
                        case 'nil':
                            return (() => {
                                var error$5 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found end of file.")(List$nil))));
                                return Parser$Reply$error(code$2)(error$5)
                            })();
                        case 'cons':
                            var $89 = self.charCodeAt(0);
                            var $90 = self.slice(1);
                            return (() => {
                                var self = ($87 === $89);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$text($88)($90);
                                    case 'false':
                                        return (() => {
                                            var error$7 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found \'")(List$cons(String$cons($89)(String$nil))(List$cons("\'.")(List$nil))))));
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
                var $91 = self.code;
                var $92 = self.err;
                return Parser$Reply$error(code$2)($92);
            case 'Parser.Reply.value':
                var $93 = self.code;
                var $94 = self.val;
                return Parser$Reply$value($93)($94);
        }
    })()));
    var Parser$char_if = (fun$1 => (code$2 => (() => {
        var self = code$2;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$2)("No parse.");
            case 'cons':
                var $95 = self.charCodeAt(0);
                var $96 = self.slice(1);
                return (() => {
                    var self = fun$1($95);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($96)($95);
                        case 'false':
                            return Parser$Reply$error(code$2)("No parse.");
                    }
                })();
        }
    })()));
    var Bool$not = a0 => (!a0);
    var Fm$Parser$spaces = Parser$many(Parser$first_of(List$cons(Parser$text(" "))(List$cons(Parser$text("\u{a}"))(List$cons(Monad$bind(Parser$monad)(Parser$text("//"))(($1 => Monad$bind(Parser$monad)(Parser$many(Parser$char_if((chr$2 => (!(chr$2 === 10))))))(($2 => Parser$text("\u{a}"))))))(List$nil)))));
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
                var $97 = self.charCodeAt(0);
                var $98 = self.slice(1);
                return (() => {
                    var self = Fm$Name$is_letter($97);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($98)($97);
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
                var $99 = self.bind;
                var $100 = self.pure;
                return $100;
        }
    })());
    var Fm$Parser$name = Monad$bind(Parser$monad)(Parser$many(Fm$Parser$letter))((chrs$1 => Monad$pure(Parser$monad)(List$fold(chrs$1)(String$nil)(String$cons))));
    var Parser$many1 = (parser$2 => Monad$bind(Parser$monad)(parser$2)((head$3 => Monad$bind(Parser$monad)(Parser$many(parser$2))((tail$4 => Monad$pure(Parser$monad)(List$cons(head$3)(tail$4)))))));
    var Fm$Parser$spaces_text = (text$1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Parser$text(text$1))));
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
                    var $101 = self.eras;
                    var $102 = self.name;
                    var $103 = self.term;
                    return Fm$Term$all($101)("")($102)($103)((s$11 => (x$12 => t$7)));
            }
        })())));
        return Monad$pure(Parser$monad)((() => {
            var self = term$6;
            switch (self._) {
                case 'Fm.Term.var':
                    var $104 = self.name;
                    var $105 = self.indx;
                    return term$6;
                case 'Fm.Term.ref':
                    var $106 = self.name;
                    return term$6;
                case 'Fm.Term.typ':
                    return term$6;
                case 'Fm.Term.all':
                    var $107 = self.eras;
                    var $108 = self.self;
                    var $109 = self.name;
                    var $110 = self.xtyp;
                    var $111 = self.body;
                    return Fm$Term$all($107)(self$2)($109)($110)($111);
                case 'Fm.Term.lam':
                    var $112 = self.name;
                    var $113 = self.body;
                    return term$6;
                case 'Fm.Term.app':
                    var $114 = self.func;
                    var $115 = self.argm;
                    return term$6;
                case 'Fm.Term.let':
                    var $116 = self.name;
                    var $117 = self.expr;
                    var $118 = self.body;
                    return term$6;
                case 'Fm.Term.def':
                    var $119 = self.name;
                    var $120 = self.expr;
                    var $121 = self.body;
                    return term$6;
                case 'Fm.Term.ann':
                    var $122 = self.done;
                    var $123 = self.term;
                    var $124 = self.type;
                    return term$6;
                case 'Fm.Term.gol':
                    var $125 = self.name;
                    var $126 = self.dref;
                    var $127 = self.verb;
                    return term$6;
                case 'Fm.Term.hol':
                    var $128 = self.path;
                    return term$6;
                case 'Fm.Term.nat':
                    var $129 = self.natx;
                    return term$6;
                case 'Fm.Term.chr':
                    var $130 = self.chrx;
                    return term$6;
                case 'Fm.Term.str':
                    var $131 = self.strx;
                    return term$6;
                case 'Fm.Term.sug':
                    var $132 = self.sugx;
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
                var $133 = self.head;
                var $134 = self.tail;
                return Fm$Term$lam($133)((x$5 => Fm$Parser$make_lambda($134)(body$2)));
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
    var List$mapped = (as$2 => (f$4 => (() => {
        var self = as$2;
        switch (self._) {
            case 'List.nil':
                return List$nil;
            case 'List.cons':
                var $135 = self.head;
                var $136 = self.tail;
                return List$cons(f$4($135))(List$mapped($136)(f$4));
        }
    })()));
    var Parser$one = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("Unexpected end of file.");
            case 'cons':
                var $137 = self.charCodeAt(0);
                var $138 = self.slice(1);
                return Parser$Reply$value($138)($137);
        }
    })());
    var Fm$Parser$char$single = (() => {
        var escs$1 = List$cons(Pair$new("\\b")(8))(List$cons(Pair$new("\\f")(12))(List$cons(Pair$new("\\n")(10))(List$cons(Pair$new("\\r")(13))(List$cons(Pair$new("\\t")(9))(List$cons(Pair$new("\\v")(11))(List$cons(Pair$new("\\\"")(34))(List$cons(Pair$new("\\0")(0))(List$cons(Pair$new("\\\'")(39))(List$nil)))))))));
        return Parser$first_of(List$cons(Parser$first_of(List$mapped(escs$1)((esc$2 => (() => {
            var self = esc$2;
            switch (self._) {
                case 'Pair.new':
                    var $139 = self.fst;
                    var $140 = self.snd;
                    return Monad$bind(Parser$monad)(Parser$text($139))(($5 => Monad$pure(Parser$monad)($140)));
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
                var $141 = self.code;
                var $142 = self.err;
                return b$3(code$4);
            case 'Parser.Reply.value':
                var $143 = self.code;
                var $144 = self.val;
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
                            var $145 = self.val;
                            var $146 = self.lft;
                            var $147 = self.rgt;
                            return Map$tie(Maybe$some(val$3))($146)($147);
                    }
                })();
            case '0':
                var $148 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$set($148)(val$3)(Map$new))(Map$new);
                        case 'Map.tie':
                            var $149 = self.val;
                            var $150 = self.lft;
                            var $151 = self.rgt;
                            return Map$tie($149)(Map$set($148)(val$3)($150))($151);
                    }
                })();
            case '1':
                var $152 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$new)(Map$set($152)(val$3)(Map$new));
                        case 'Map.tie':
                            var $153 = self.val;
                            var $154 = self.lft;
                            var $155 = self.rgt;
                            return Map$tie($153)($154)(Map$set($152)(val$3)($155));
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
                var $156 = self.head;
                var $157 = self.tail;
                return (() => {
                    var self = $156;
                    switch (self._) {
                        case 'Pair.new':
                            var $158 = self.fst;
                            var $159 = self.snd;
                            return Map$set(f$3($158))($159)(Map$from_list(f$3)($157));
                    }
                })();
        }
    })()));
    var U16$new = (value$1 => word_to_u16(value$1));
    var Word$nil = ({
        _: 'Word.nil'
    });
    var Word = (size$1 => null);
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
                var $160 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $161 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$subber(a$pred$10)($161)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($161)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $162 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$subber(a$pred$10)($162)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($162)(Bool$true));
                                }
                            })());
                    }
                })()($160));
            case 'Word.1':
                var $163 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $164 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$subber(a$pred$10)($164)(Bool$false));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($164)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $165 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$subber(a$pred$10)($165)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($165)(Bool$false));
                                }
                            })());
                    }
                })()($163));
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
                        var $166 = (self - 1n);
                        return Nat$apply($166)(f$3)(f$3(x$4));
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
                var $167 = self.pred;
                return Word$1($167);
            case 'Word.1':
                var $168 = self.pred;
                return Word$0(Word$inc($168));
        }
    })());
    var U16$inc = (a$1 => (() => {
        var self = a$1;
        switch ('u16') {
            case 'u16':
                var $169 = u16_to_word(self);
                return U16$new(Word$inc($169));
        }
    })());
    var Word$zero = (size$1 => (() => {
        var self = size$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $170 = (self - 1n);
                return Word$0(Word$zero($170));
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
                var $171 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $172 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($172)(Bool$false));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($172)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $173 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($173)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($173)(Bool$false));
                                }
                            })());
                    }
                })()($171));
            case 'Word.1':
                var $174 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $175 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($175)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($175)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $176 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($176)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($176)(Bool$true));
                                }
                            })());
                    }
                })()($174));
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
                var $177 = self.pred;
                return Bits$0(Word$to_bits($177));
            case 'Word.1':
                var $178 = self.pred;
                return Bits$1(Word$to_bits($178));
        }
    })());
    var Word$trim = (new_size$2 => (word$3 => (() => {
        var self = new_size$2;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $179 = (self - 1n);
                return (() => {
                    var self = word$3;
                    switch (self._) {
                        case 'Word.nil':
                            return Word$0(Word$trim($179)(Word$nil));
                        case 'Word.0':
                            var $180 = self.pred;
                            return Word$0(Word$trim($179)($180));
                        case 'Word.1':
                            var $181 = self.pred;
                            return Word$1(Word$trim($179)($181));
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
                        var $182 = self.slice(0, -1);
                        return Bits$reverse$tco($182)(Bits$0(r$2));
                    case '1':
                        var $183 = self.slice(0, -1);
                        return Bits$reverse$tco($183)(Bits$1(r$2));
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
                                var $184 = self.name;
                                var $185 = self.indx;
                                return $184;
                            case 'Fm.Term.ref':
                                var $186 = self.name;
                                return $186;
                            case 'Fm.Term.typ':
                                return Fm$Name$read("self");
                            case 'Fm.Term.all':
                                var $187 = self.eras;
                                var $188 = self.self;
                                var $189 = self.name;
                                var $190 = self.xtyp;
                                var $191 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.lam':
                                var $192 = self.name;
                                var $193 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.app':
                                var $194 = self.func;
                                var $195 = self.argm;
                                return Fm$Name$read("self");
                            case 'Fm.Term.let':
                                var $196 = self.name;
                                var $197 = self.expr;
                                var $198 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.def':
                                var $199 = self.name;
                                var $200 = self.expr;
                                var $201 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.ann':
                                var $202 = self.done;
                                var $203 = self.term;
                                var $204 = self.type;
                                return Fm$Name$read("self");
                            case 'Fm.Term.gol':
                                var $205 = self.name;
                                var $206 = self.dref;
                                var $207 = self.verb;
                                return Fm$Name$read("self");
                            case 'Fm.Term.hol':
                                var $208 = self.path;
                                return Fm$Name$read("self");
                            case 'Fm.Term.nat':
                                var $209 = self.natx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.chr':
                                var $210 = self.chrx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.str':
                                var $211 = self.strx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.sug':
                                var $212 = self.sugx;
                                return Fm$Name$read("self");
                        }
                    })();
                case 'Maybe.some':
                    var $213 = self.value;
                    return $213;
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
                            var $214 = self.value;
                            return $214;
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
                var $215 = self.charCodeAt(0);
                var $216 = self.slice(1);
                return (() => {
                    var self = ($215 === 48);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($216)(0n);
                        case 'false':
                            return (() => {
                                var self = ($215 === 49);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$Reply$value($216)(1n);
                                    case 'false':
                                        return (() => {
                                            var self = ($215 === 50);
                                            switch (self ? 'true' : 'false') {
                                                case 'true':
                                                    return Parser$Reply$value($216)(2n);
                                                case 'false':
                                                    return (() => {
                                                        var self = ($215 === 51);
                                                        switch (self ? 'true' : 'false') {
                                                            case 'true':
                                                                return Parser$Reply$value($216)(3n);
                                                            case 'false':
                                                                return (() => {
                                                                    var self = ($215 === 52);
                                                                    switch (self ? 'true' : 'false') {
                                                                        case 'true':
                                                                            return Parser$Reply$value($216)(4n);
                                                                        case 'false':
                                                                            return (() => {
                                                                                var self = ($215 === 53);
                                                                                switch (self ? 'true' : 'false') {
                                                                                    case 'true':
                                                                                        return Parser$Reply$value($216)(5n);
                                                                                    case 'false':
                                                                                        return (() => {
                                                                                            var self = ($215 === 54);
                                                                                            switch (self ? 'true' : 'false') {
                                                                                                case 'true':
                                                                                                    return Parser$Reply$value($216)(6n);
                                                                                                case 'false':
                                                                                                    return (() => {
                                                                                                        var self = ($215 === 55);
                                                                                                        switch (self ? 'true' : 'false') {
                                                                                                            case 'true':
                                                                                                                return Parser$Reply$value($216)(7n);
                                                                                                            case 'false':
                                                                                                                return (() => {
                                                                                                                    var self = ($215 === 56);
                                                                                                                    switch (self ? 'true' : 'false') {
                                                                                                                        case 'true':
                                                                                                                            return Parser$Reply$value($216)(8n);
                                                                                                                        case 'false':
                                                                                                                            return (() => {
                                                                                                                                var self = ($215 === 57);
                                                                                                                                switch (self ? 'true' : 'false') {
                                                                                                                                    case 'true':
                                                                                                                                        return Parser$Reply$value($216)(9n);
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
                        var $217 = self.head;
                        var $218 = self.tail;
                        return Nat$from_base$go(b$1)($218)((b$1 * p$3))((($217 * p$3) + res$4));
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
                        var $219 = self.head;
                        var $220 = self.tail;
                        return List$reverse$go($220)(List$cons($219)(res$3));
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
                var $221 = self.slice(0, -1);
                return $221;
            case '1':
                var $222 = self.slice(0, -1);
                return $222;
        }
    })());
    var Bits$inc = (a$1 => (() => {
        var self = a$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return Bits$1(Bits$nil);
            case '0':
                var $223 = self.slice(0, -1);
                return Bits$1($223);
            case '1':
                var $224 = self.slice(0, -1);
                return Bits$0(Bits$inc($224));
        }
    })());
    var Nat$to_bits = a0 => (nat_to_bits(a0));
    var Maybe$to_bool = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Maybe.none':
                return Bool$false;
            case 'Maybe.some':
                var $225 = self.value;
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
                            var $226 = self.code;
                            var $227 = self.err;
                            return Parser$Reply$value(code$2)(term$1);
                        case 'Parser.Reply.value':
                            var $228 = self.code;
                            var $229 = self.val;
                            return Fm$Parser$suffix($229)($228);
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
                var $230 = self.fst;
                var $231 = self.snd;
                return Fm$Binder$new(eras$1)($230)($231);
        }
    })()))))))))));
    var List$concat = (as$2 => (bs$3 => (() => {
        var self = as$2;
        switch (self._) {
            case 'List.nil':
                return bs$3;
            case 'List.cons':
                var $232 = self.head;
                var $233 = self.tail;
                return List$cons($232)(List$concat($233)(bs$3));
        }
    })()));
    var List$flatten = (xs$2 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'List.nil':
                return List$nil;
            case 'List.cons':
                var $234 = self.head;
                var $235 = self.tail;
                return List$concat($234)(List$flatten($235));
        }
    })());
    var Fm$Parser$binder = Monad$bind(Parser$monad)(Parser$many1(Parser$first_of(List$cons(Fm$Parser$binder$homo(Bool$true))(List$cons(Fm$Parser$binder$homo(Bool$false))(List$nil)))))((lists$1 => Monad$pure(Parser$monad)(List$flatten(lists$1))));
    var Fm$Parser$make_forall = (binds$1 => (body$2 => (() => {
        var self = binds$1;
        switch (self._) {
            case 'List.nil':
                return body$2;
            case 'List.cons':
                var $236 = self.head;
                var $237 = self.tail;
                return (() => {
                    var self = $236;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $238 = self.eras;
                            var $239 = self.name;
                            var $240 = self.term;
                            return Fm$Term$all($238)("")($239)($240)((s$8 => (x$9 => Fm$Parser$make_forall($237)(body$2))));
                    }
                })();
        }
    })()));
    var List$at_last = (index$2 => (list$3 => List$at(index$2)(List$reverse(list$3))));
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
                        var $241 = self.head;
                        var $242 = self.tail;
                        return (() => {
                            var self = $241;
                            switch (self._) {
                                case 'Pair.new':
                                    var $243 = self.fst;
                                    var $244 = self.snd;
                                    return (() => {
                                        var self = Fm$Name$eql(name$1)($243);
                                        switch (self ? 'true' : 'false') {
                                            case 'true':
                                                return Maybe$some($244);
                                            case 'false':
                                                return Fm$Context$find(name$1)($242);
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
                        var $245 = self.head;
                        var $246 = self.tail;
                        return List$length$go($246)(Nat$succ(n$3));
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
                var $247 = self.name;
                var $248 = self.indx;
                return (() => {
                    var self = List$at_last($248)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$var($247)($248);
                        case 'Maybe.some':
                            var $249 = self.value;
                            return Pair$snd($249);
                    }
                })();
            case 'Fm.Term.ref':
                var $250 = self.name;
                return (() => {
                    var self = Fm$Context$find($250)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($250);
                        case 'Maybe.some':
                            var $251 = self.value;
                            return $251;
                    }
                })();
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $252 = self.eras;
                var $253 = self.self;
                var $254 = self.name;
                var $255 = self.xtyp;
                var $256 = self.body;
                return (() => {
                    var vlen$9 = List$length(vars$1);
                    return Fm$Term$all($252)($253)($254)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($255))((s$10 => (x$11 => Fm$Term$bind(List$cons(Pair$new($254)(x$11))(List$cons(Pair$new($253)(s$10))(vars$1)))(Fm$Path$1(path$2))($256(Fm$Term$var($253)(vlen$9))(Fm$Term$var($254)(Nat$succ(vlen$9)))))))
                })();
            case 'Fm.Term.lam':
                var $257 = self.name;
                var $258 = self.body;
                return (() => {
                    var vlen$6 = List$length(vars$1);
                    return Fm$Term$lam($257)((x$7 => Fm$Term$bind(List$cons(Pair$new($257)(x$7))(vars$1))(Fm$Path$0(path$2))($258(Fm$Term$var($257)(vlen$6)))))
                })();
            case 'Fm.Term.app':
                var $259 = self.func;
                var $260 = self.argm;
                return Fm$Term$app(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($259))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($260));
            case 'Fm.Term.let':
                var $261 = self.name;
                var $262 = self.expr;
                var $263 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$let($261)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($262))((x$8 => Fm$Term$bind(List$cons(Pair$new($261)(x$8))(vars$1))(Fm$Path$1(path$2))($263(Fm$Term$var($261)(vlen$7)))))
                })();
            case 'Fm.Term.def':
                var $264 = self.name;
                var $265 = self.expr;
                var $266 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$def($264)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($265))((x$8 => Fm$Term$bind(List$cons(Pair$new($264)(x$8))(vars$1))(Fm$Path$1(path$2))($266(Fm$Term$var($264)(vlen$7)))))
                })();
            case 'Fm.Term.ann':
                var $267 = self.done;
                var $268 = self.term;
                var $269 = self.type;
                return Fm$Term$ann($267)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($268))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($269));
            case 'Fm.Term.gol':
                var $270 = self.name;
                var $271 = self.dref;
                var $272 = self.verb;
                return Fm$Term$gol($270)($271)($272);
            case 'Fm.Term.hol':
                var $273 = self.path;
                return Fm$Term$hol(Fm$Path$to_bits(path$2));
            case 'Fm.Term.nat':
                var $274 = self.natx;
                return Fm$Term$nat($274);
            case 'Fm.Term.chr':
                var $275 = self.chrx;
                return Fm$Term$chr($275);
            case 'Fm.Term.str':
                var $276 = self.strx;
                return Fm$Term$str($276);
            case 'Fm.Term.sug':
                var $277 = self.sugx;
                return (() => {
                    var self = $277;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $278 = self.func;
                            var $279 = self.args;
                            return (() => {
                                var func$7 = Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($278);
                                var args$8 = $279;
                                return Fm$Term$sug(Fm$Sugar$app(func$7)(args$8))
                            })();
                        case 'Fm.Sugar.cse':
                            var $280 = self.expr;
                            var $281 = self.name;
                            var $282 = self.with;
                            var $283 = self.cses;
                            var $284 = self.moti;
                            return (() => {
                                var expr$10 = Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($280);
                                var name$11 = $281;
                                var with$12 = $282;
                                var cses$13 = $283;
                                var moti$14 = $284;
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
                        var $285 = self.eras;
                        var $286 = self.name;
                        var $287 = self.term;
                        return $286;
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
                            var $288 = self.name;
                            var $289 = self.pars;
                            var $290 = self.inds;
                            var $291 = self.ctrs;
                            return (() => {
                                var slf$8 = Fm$Term$ref(name$2);
                                var slf$9 = (list_for($289)(slf$8)((var$9 => (slf$10 => Fm$Term$app(slf$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $292 = self.eras;
                                            var $293 = self.name;
                                            var $294 = self.term;
                                            return $293;
                                    }
                                })()))))));
                                var slf$10 = (list_for($290)(slf$9)((var$10 => (slf$11 => Fm$Term$app(slf$11)(Fm$Term$ref((() => {
                                    var self = var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $295 = self.eras;
                                            var $296 = self.name;
                                            var $297 = self.term;
                                            return $296;
                                    }
                                })()))))));
                                return Fm$Term$all(Bool$false)("")(Fm$Name$read("self"))(slf$10)((s$11 => (x$12 => Fm$Term$typ)))
                            })();
                    }
                })();
            case 'List.cons':
                var $298 = self.head;
                var $299 = self.tail;
                return (() => {
                    var self = $298;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $300 = self.eras;
                            var $301 = self.name;
                            var $302 = self.term;
                            return Fm$Term$all($300)("")($301)($302)((s$9 => (x$10 => Fm$Datatype$build_term$motive$go(type$1)(name$2)($299))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$motive = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $303 = self.name;
                var $304 = self.pars;
                var $305 = self.inds;
                var $306 = self.ctrs;
                return Fm$Datatype$build_term$motive$go(type$1)($303)($305);
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
                            var $307 = self.name;
                            var $308 = self.pars;
                            var $309 = self.inds;
                            var $310 = self.ctrs;
                            return (() => {
                                var self = ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $311 = self.name;
                                        var $312 = self.args;
                                        var $313 = self.inds;
                                        return (() => {
                                            var ret$11 = Fm$Term$ref(Fm$Name$read("P"));
                                            var ret$12 = (list_for($313)(ret$11)((var$12 => (ret$13 => Fm$Term$app(ret$13)((() => {
                                                var self = var$12;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $314 = self.eras;
                                                        var $315 = self.name;
                                                        var $316 = self.term;
                                                        return $316;
                                                }
                                            })())))));
                                            var ctr$13 = String$flatten(List$cons($307)(List$cons(Fm$Name$read("."))(List$cons($311)(List$nil))));
                                            var slf$14 = Fm$Term$ref(ctr$13);
                                            var slf$15 = (list_for($308)(slf$14)((var$15 => (slf$16 => Fm$Term$app(slf$16)(Fm$Term$ref((() => {
                                                var self = var$15;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $317 = self.eras;
                                                        var $318 = self.name;
                                                        var $319 = self.term;
                                                        return $318;
                                                }
                                            })()))))));
                                            var slf$16 = (list_for($312)(slf$15)((var$16 => (slf$17 => Fm$Term$app(slf$17)(Fm$Term$ref((() => {
                                                var self = var$16;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $320 = self.eras;
                                                        var $321 = self.name;
                                                        var $322 = self.term;
                                                        return $321;
                                                }
                                            })()))))));
                                            return Fm$Term$app(ret$12)(slf$16)
                                        })();
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $323 = self.head;
                var $324 = self.tail;
                return (() => {
                    var eras$6 = (() => {
                        var self = $323;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $325 = self.eras;
                                var $326 = self.name;
                                var $327 = self.term;
                                return $325;
                        }
                    })();
                    var name$7 = (() => {
                        var self = $323;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $328 = self.eras;
                                var $329 = self.name;
                                var $330 = self.term;
                                return $329;
                        }
                    })();
                    var xtyp$8 = (() => {
                        var self = $323;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $331 = self.eras;
                                var $332 = self.name;
                                var $333 = self.term;
                                return $333;
                        }
                    })();
                    var body$9 = Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($324);
                    return Fm$Term$all(eras$6)("")(name$7)(xtyp$8)((s$10 => (x$11 => body$9)))
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructor = (type$1 => (ctor$2 => (() => {
        var self = ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $334 = self.name;
                var $335 = self.args;
                var $336 = self.inds;
                return Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($335);
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
                            var $337 = self.name;
                            var $338 = self.pars;
                            var $339 = self.inds;
                            var $340 = self.ctrs;
                            return (() => {
                                var ret$8 = Fm$Term$ref(Fm$Name$read("P"));
                                var ret$9 = (list_for($339)(ret$8)((var$9 => (ret$10 => Fm$Term$app(ret$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $341 = self.eras;
                                            var $342 = self.name;
                                            var $343 = self.term;
                                            return $342;
                                    }
                                })()))))));
                                return Fm$Term$app(ret$9)(Fm$Term$ref((name$2 + ".Self")))
                            })();
                    }
                })();
            case 'List.cons':
                var $344 = self.head;
                var $345 = self.tail;
                return (() => {
                    var self = $344;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $346 = self.name;
                            var $347 = self.args;
                            var $348 = self.inds;
                            return Fm$Term$all(Bool$false)("")($346)(Fm$Datatype$build_term$constructor(type$1)($344))((s$9 => (x$10 => Fm$Datatype$build_term$constructors$go(type$1)(name$2)($345))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructors = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $349 = self.name;
                var $350 = self.pars;
                var $351 = self.inds;
                var $352 = self.ctrs;
                return Fm$Datatype$build_term$constructors$go(type$1)($349)($352);
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
                            var $353 = self.head;
                            var $354 = self.tail;
                            return (() => {
                                var self = $353;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $355 = self.eras;
                                        var $356 = self.name;
                                        var $357 = self.term;
                                        return Fm$Term$lam($356)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)(pars$3)($354)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $358 = self.head;
                var $359 = self.tail;
                return (() => {
                    var self = $358;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $360 = self.eras;
                            var $361 = self.name;
                            var $362 = self.term;
                            return Fm$Term$lam($361)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)($359)(inds$4)));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_term = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $363 = self.name;
                var $364 = self.pars;
                var $365 = self.inds;
                var $366 = self.ctrs;
                return Fm$Datatype$build_term$go(type$1)($363)($364)($365);
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
                            var $367 = self.head;
                            var $368 = self.tail;
                            return (() => {
                                var self = $367;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $369 = self.eras;
                                        var $370 = self.name;
                                        var $371 = self.term;
                                        return Fm$Term$all(Bool$false)("")($370)($371)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)(pars$3)($368))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $372 = self.head;
                var $373 = self.tail;
                return (() => {
                    var self = $372;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $374 = self.eras;
                            var $375 = self.name;
                            var $376 = self.term;
                            return Fm$Term$all(Bool$false)("")($375)($376)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)($373)(inds$4))));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_type = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $377 = self.name;
                var $378 = self.pars;
                var $379 = self.inds;
                var $380 = self.ctrs;
                return Fm$Datatype$build_type$go(type$1)($377)($378)($379);
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
                            var $381 = self.name;
                            var $382 = self.args;
                            var $383 = self.inds;
                            return (() => {
                                var ret$7 = Fm$Term$ref($381);
                                var ret$8 = (list_for($382)(ret$7)((arg$8 => (ret$9 => Fm$Term$app(ret$9)(Fm$Term$ref((() => {
                                    var self = arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $384 = self.eras;
                                            var $385 = self.name;
                                            var $386 = self.term;
                                            return $385;
                                    }
                                })()))))));
                                return ret$8
                            })();
                    }
                })();
            case 'List.cons':
                var $387 = self.head;
                var $388 = self.tail;
                return (() => {
                    var self = $387;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $389 = self.name;
                            var $390 = self.args;
                            var $391 = self.inds;
                            return Fm$Term$lam($389)((x$9 => Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($388)));
                    }
                })();
        }
    })())));
    var Fm$Constructor$build_term$opt = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $392 = self.name;
                var $393 = self.pars;
                var $394 = self.inds;
                var $395 = self.ctrs;
                return Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($395);
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
                            var $396 = self.head;
                            var $397 = self.tail;
                            return (() => {
                                var self = $396;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $398 = self.eras;
                                        var $399 = self.name;
                                        var $400 = self.term;
                                        return Fm$Term$lam($399)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)(pars$4)($397)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $401 = self.head;
                var $402 = self.tail;
                return (() => {
                    var self = $401;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $403 = self.eras;
                            var $404 = self.name;
                            var $405 = self.term;
                            return Fm$Term$lam($404)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)($402)(args$5)));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_term = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $406 = self.name;
                var $407 = self.pars;
                var $408 = self.inds;
                var $409 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $410 = self.name;
                            var $411 = self.args;
                            var $412 = self.inds;
                            return Fm$Constructor$build_term$go(type$1)(ctor$2)($406)($407)($411);
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
                                        var $413 = self.name;
                                        var $414 = self.pars;
                                        var $415 = self.inds;
                                        var $416 = self.ctrs;
                                        return (() => {
                                            var self = ctor$2;
                                            switch (self._) {
                                                case 'Fm.Constructor.new':
                                                    var $417 = self.name;
                                                    var $418 = self.args;
                                                    var $419 = self.inds;
                                                    return (() => {
                                                        var type$13 = Fm$Term$ref(name$3);
                                                        var type$14 = (list_for($414)(type$13)((var$14 => (type$15 => Fm$Term$app(type$15)(Fm$Term$ref((() => {
                                                            var self = var$14;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $420 = self.eras;
                                                                    var $421 = self.name;
                                                                    var $422 = self.term;
                                                                    return $421;
                                                            }
                                                        })()))))));
                                                        var type$15 = (list_for($419)(type$14)((var$15 => (type$16 => Fm$Term$app(type$16)((() => {
                                                            var self = var$15;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $423 = self.eras;
                                                                    var $424 = self.name;
                                                                    var $425 = self.term;
                                                                    return $425;
                                                            }
                                                        })())))));
                                                        return type$15
                                                    })();
                                            }
                                        })();
                                }
                            })();
                        case 'List.cons':
                            var $426 = self.head;
                            var $427 = self.tail;
                            return (() => {
                                var self = $426;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $428 = self.eras;
                                        var $429 = self.name;
                                        var $430 = self.term;
                                        return Fm$Term$all($428)("")($429)($430)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)(pars$4)($427))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $431 = self.head;
                var $432 = self.tail;
                return (() => {
                    var self = $431;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $433 = self.eras;
                            var $434 = self.name;
                            var $435 = self.term;
                            return Fm$Term$all($433)("")($434)($435)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)($432)(args$5))));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_type = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $436 = self.name;
                var $437 = self.pars;
                var $438 = self.inds;
                var $439 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $440 = self.name;
                            var $441 = self.args;
                            var $442 = self.inds;
                            return Fm$Constructor$build_type$go(type$1)(ctor$2)($436)($437)($441);
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
                            var $443 = self.value;
                            return (() => {
                                var self = $443;
                                switch (self._) {
                                    case 'Fm.Datatype.new':
                                        var $444 = self.name;
                                        var $445 = self.pars;
                                        var $446 = self.inds;
                                        var $447 = self.ctrs;
                                        return (() => {
                                            var term$9 = Fm$Datatype$build_term($443);
                                            var term$10 = Fm$Term$bind(List$nil)((x$10 => Bits$1(x$10)))(term$9);
                                            var type$11 = Fm$Datatype$build_type($443);
                                            var type$12 = Fm$Term$bind(List$nil)((x$12 => Bits$0(x$12)))(type$11);
                                            var defs$13 = Fm$set($444)(Fm$Def$new($444)(term$10)(type$12)(Bool$false))(defs$1);
                                            var defs$14 = List$fold($447)(defs$13)((ctr$14 => (defs$15 => (() => {
                                                var typ_name$16 = $444;
                                                var ctr_name$17 = String$flatten(List$cons(typ_name$16)(List$cons(Fm$Name$read("."))(List$cons((() => {
                                                    var self = ctr$14;
                                                    switch (self._) {
                                                        case 'Fm.Constructor.new':
                                                            var $448 = self.name;
                                                            var $449 = self.args;
                                                            var $450 = self.inds;
                                                            return $448;
                                                    }
                                                })())(List$nil))));
                                                var ctr_term$18 = Fm$Constructor$build_term($443)(ctr$14);
                                                var ctr_term$19 = Fm$Term$bind(List$nil)((x$19 => Bits$1(x$19)))(ctr_term$18);
                                                var ctr_type$20 = Fm$Constructor$build_type($443)(ctr$14);
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
                var $451 = self.value;
                return (() => {
                    var self = $451;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $452 = self.name;
                            var $453 = self.term;
                            var $454 = self.type;
                            var $455 = self.done;
                            return Fm$Parser$file$go(Fm$set($452)($451)(defs$1));
                    }
                })();
        }
    })())));
    var Fm$Parser$file = Fm$Parser$file$go(Map$new);
    var Fm$Defs$read = (code$1 => (() => {
        var self = Fm$Parser$file(code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $456 = self.code;
                var $457 = self.err;
                return Maybe$none;
            case 'Parser.Reply.value':
                var $458 = self.code;
                var $459 = self.val;
                return Maybe$some($459);
        }
    })());
    var Map$to_list$go = (xs$2 => (key$3 => (list$4 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'Map.new':
                return list$4;
            case 'Map.tie':
                var $460 = self.val;
                var $461 = self.lft;
                var $462 = self.rgt;
                return (() => {
                    var list0$8 = (() => {
                        var self = $460;
                        switch (self._) {
                            case 'Maybe.none':
                                return list$4;
                            case 'Maybe.some':
                                var $463 = self.value;
                                return List$cons(Pair$new(Bits$reverse(key$3))($463))(list$4);
                        }
                    })();
                    var list1$9 = Map$to_list$go($461)(Bits$0(key$3))(list0$8);
                    var list2$10 = Map$to_list$go($462)(Bits$1(key$3))(list1$9);
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
                var $464 = self.slice(0, -1);
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
                            var $465 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$0(chunk$4);
                                return Bits$chunks_of$go(len$1)($464)($465)(chunk$7)
                            })();
                    }
                })();
            case '1':
                var $466 = self.slice(0, -1);
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
                            var $467 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$1(chunk$4);
                                return Bits$chunks_of$go(len$1)($466)($467)(chunk$7)
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
                var $468 = (self - 1n);
                return (() => {
                    var self = bits$2;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return Word$0(Word$from_bits($468)(Bits$nil));
                        case '0':
                            var $469 = self.slice(0, -1);
                            return Word$0(Word$from_bits($468)($469));
                        case '1':
                            var $470 = self.slice(0, -1);
                            return Word$1(Word$from_bits($468)($470));
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
                var $471 = self.value;
                var $472 = self.errors;
                return (() => {
                    var self = $471;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)($472);
                        case 'Maybe.some':
                            var $473 = self.value;
                            return (() => {
                                var self = f$4($473);
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $474 = self.value;
                                        var $475 = self.errors;
                                        return Fm$Check$result($474)(List$concat($472)($475));
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
                                    var $476 = self.val;
                                    var $477 = self.lft;
                                    var $478 = self.rgt;
                                    return $476;
                            }
                        })();
                    case '0':
                        var $479 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $480 = self.val;
                                    var $481 = self.lft;
                                    var $482 = self.rgt;
                                    return Map$get($479)($481);
                            }
                        })();
                    case '1':
                        var $483 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $484 = self.val;
                                    var $485 = self.lft;
                                    var $486 = self.rgt;
                                    return Map$get($483)($486);
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
                var $487 = self.value;
                return Maybe$some(f$4($487));
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
                var $488 = (self - 1n);
                return (() => {
                    var func$3 = Fm$Term$ref(Fm$Name$read("Nat.succ"));
                    var argm$4 = Fm$Term$nat($488);
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
                var $489 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.0")))(Fm$Term$unroll_chr$bits($489));
            case '1':
                var $490 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.1")))(Fm$Term$unroll_chr$bits($490));
        }
    })());
    var Fm$Term$unroll_chr = (chrx$1 => (() => {
        var self = chrx$1;
        switch ('u16') {
            case 'u16':
                var $491 = u16_to_word(self);
                return (() => {
                    var term$3 = Fm$Term$ref(Fm$Name$read("Word.from_bits"));
                    var term$4 = Fm$Term$app(term$3)(Fm$Term$nat(16n));
                    var term$5 = Fm$Term$app(term$4)(Fm$Term$unroll_chr$bits(Word$to_bits($491)));
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
                var $492 = self.charCodeAt(0);
                var $493 = self.slice(1);
                return (() => {
                    var char$4 = Fm$Term$chr($492);
                    var term$5 = Fm$Term$ref(Fm$Name$read("String.cons"));
                    var term$6 = Fm$Term$app(term$5)(char$4);
                    var term$7 = Fm$Term$app(term$6)(Fm$Term$str($493));
                    return term$7
                })();
        }
    })());
    var Fm$Term$reduce = (term$1 => (defs$2 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $494 = self.name;
                var $495 = self.indx;
                return term$1;
            case 'Fm.Term.ref':
                var $496 = self.name;
                return (() => {
                    var self = Fm$get($496)(defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($496);
                        case 'Maybe.some':
                            var $497 = self.value;
                            return (() => {
                                var self = $497;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $498 = self.name;
                                        var $499 = self.term;
                                        var $500 = self.type;
                                        var $501 = self.done;
                                        return Fm$Term$reduce($499)(defs$2);
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$1;
            case 'Fm.Term.all':
                var $502 = self.eras;
                var $503 = self.self;
                var $504 = self.name;
                var $505 = self.xtyp;
                var $506 = self.body;
                return term$1;
            case 'Fm.Term.lam':
                var $507 = self.name;
                var $508 = self.body;
                return term$1;
            case 'Fm.Term.app':
                var $509 = self.func;
                var $510 = self.argm;
                return (() => {
                    var func$5 = Fm$Term$reduce($509)(defs$2);
                    return (() => {
                        var self = func$5;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $511 = self.name;
                                var $512 = self.indx;
                                return term$1;
                            case 'Fm.Term.ref':
                                var $513 = self.name;
                                return term$1;
                            case 'Fm.Term.typ':
                                return term$1;
                            case 'Fm.Term.all':
                                var $514 = self.eras;
                                var $515 = self.self;
                                var $516 = self.name;
                                var $517 = self.xtyp;
                                var $518 = self.body;
                                return term$1;
                            case 'Fm.Term.lam':
                                var $519 = self.name;
                                var $520 = self.body;
                                return Fm$Term$reduce($520($510))(defs$2);
                            case 'Fm.Term.app':
                                var $521 = self.func;
                                var $522 = self.argm;
                                return term$1;
                            case 'Fm.Term.let':
                                var $523 = self.name;
                                var $524 = self.expr;
                                var $525 = self.body;
                                return term$1;
                            case 'Fm.Term.def':
                                var $526 = self.name;
                                var $527 = self.expr;
                                var $528 = self.body;
                                return term$1;
                            case 'Fm.Term.ann':
                                var $529 = self.done;
                                var $530 = self.term;
                                var $531 = self.type;
                                return term$1;
                            case 'Fm.Term.gol':
                                var $532 = self.name;
                                var $533 = self.dref;
                                var $534 = self.verb;
                                return term$1;
                            case 'Fm.Term.hol':
                                var $535 = self.path;
                                return term$1;
                            case 'Fm.Term.nat':
                                var $536 = self.natx;
                                return term$1;
                            case 'Fm.Term.chr':
                                var $537 = self.chrx;
                                return term$1;
                            case 'Fm.Term.str':
                                var $538 = self.strx;
                                return term$1;
                            case 'Fm.Term.sug':
                                var $539 = self.sugx;
                                return term$1;
                        }
                    })()
                })();
            case 'Fm.Term.let':
                var $540 = self.name;
                var $541 = self.expr;
                var $542 = self.body;
                return Fm$Term$reduce($542($541))(defs$2);
            case 'Fm.Term.def':
                var $543 = self.name;
                var $544 = self.expr;
                var $545 = self.body;
                return Fm$Term$reduce($545($544))(defs$2);
            case 'Fm.Term.ann':
                var $546 = self.done;
                var $547 = self.term;
                var $548 = self.type;
                return Fm$Term$reduce($547)(defs$2);
            case 'Fm.Term.gol':
                var $549 = self.name;
                var $550 = self.dref;
                var $551 = self.verb;
                return term$1;
            case 'Fm.Term.hol':
                var $552 = self.path;
                return term$1;
            case 'Fm.Term.nat':
                var $553 = self.natx;
                return Fm$Term$reduce(Fm$Term$unroll_nat($553))(defs$2);
            case 'Fm.Term.chr':
                var $554 = self.chrx;
                return Fm$Term$reduce(Fm$Term$unroll_chr($554))(defs$2);
            case 'Fm.Term.str':
                var $555 = self.strx;
                return Fm$Term$reduce(Fm$Term$unroll_str($555))(defs$2);
            case 'Fm.Term.sug':
                var $556 = self.sugx;
                return term$1;
        }
    })()));
    var Fm$Error$type_mismatch = (expected$1 => (detected$2 => (context$3 => ({
        _: 'Fm.Error.type_mismatch',
        'expected': expected$1,
        'detected': detected$2,
        'context': context$3
    }))));
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
                        var $557 = self.name;
                        var $558 = self.indx;
                        return func$1;
                    case 'Fm.Term.ref':
                        var $559 = self.name;
                        return func$1;
                    case 'Fm.Term.typ':
                        return func$1;
                    case 'Fm.Term.all':
                        var $560 = self.eras;
                        var $561 = self.self;
                        var $562 = self.name;
                        var $563 = self.xtyp;
                        var $564 = self.body;
                        return (() => {
                            var self = Fm$get($562)(args$2);
                            switch (self._) {
                                case 'Maybe.none':
                                    return func$1;
                                case 'Maybe.some':
                                    var $565 = self.value;
                                    return (() => {
                                        var func$11 = Fm$Term$app(func$1)($565);
                                        var type$12 = $564(Fm$Term$var($561)(0n))(Fm$Term$var($562)(0n));
                                        return Fm$Term$desugar_app(func$11)(args$2)(type$12)(defs$4)
                                    })();
                            }
                        })();
                    case 'Fm.Term.lam':
                        var $566 = self.name;
                        var $567 = self.body;
                        return func$1;
                    case 'Fm.Term.app':
                        var $568 = self.func;
                        var $569 = self.argm;
                        return func$1;
                    case 'Fm.Term.let':
                        var $570 = self.name;
                        var $571 = self.expr;
                        var $572 = self.body;
                        return func$1;
                    case 'Fm.Term.def':
                        var $573 = self.name;
                        var $574 = self.expr;
                        var $575 = self.body;
                        return func$1;
                    case 'Fm.Term.ann':
                        var $576 = self.done;
                        var $577 = self.term;
                        var $578 = self.type;
                        return func$1;
                    case 'Fm.Term.gol':
                        var $579 = self.name;
                        var $580 = self.dref;
                        var $581 = self.verb;
                        return func$1;
                    case 'Fm.Term.hol':
                        var $582 = self.path;
                        return func$1;
                    case 'Fm.Term.nat':
                        var $583 = self.natx;
                        return func$1;
                    case 'Fm.Term.chr':
                        var $584 = self.chrx;
                        return func$1;
                    case 'Fm.Term.str':
                        var $585 = self.strx;
                        return func$1;
                    case 'Fm.Term.sug':
                        var $586 = self.sugx;
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
                var $587 = self.value;
                return $587(Bits$nil);
        }
    })());
    var Fm$Term$desugar_cse$motive = (wyth$1 => (moti$2 => (() => {
        var self = wyth$1;
        switch (self._) {
            case 'List.nil':
                return moti$2;
            case 'List.cons':
                var $588 = self.head;
                var $589 = self.tail;
                return (() => {
                    var self = $588;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $590 = self.name;
                            var $591 = self.term;
                            var $592 = self.type;
                            var $593 = self.done;
                            return Fm$Term$all(Bool$false)("")($590)($592)((s$9 => (x$10 => Fm$Term$desugar_cse$motive($589)(moti$2))));
                    }
                })();
        }
    })()));
    var Fm$Term$desugar_cse$argument = (name$1 => (wyth$2 => (type$3 => (body$4 => (defs$5 => (() => {
        var self = Fm$Term$reduce(type$3)(defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $594 = self.name;
                var $595 = self.indx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $596 = self.head;
                            var $597 = self.tail;
                            return (() => {
                                var self = $596;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $598 = self.name;
                                        var $599 = self.term;
                                        var $600 = self.type;
                                        var $601 = self.done;
                                        return Fm$Term$lam($598)((x$14 => Fm$Term$desugar_cse$argument(name$1)($597)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $602 = self.name;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $603 = self.head;
                            var $604 = self.tail;
                            return (() => {
                                var self = $603;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $605 = self.name;
                                        var $606 = self.term;
                                        var $607 = self.type;
                                        var $608 = self.done;
                                        return Fm$Term$lam($605)((x$13 => Fm$Term$desugar_cse$argument(name$1)($604)(type$3)(body$4)(defs$5)));
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
                            var $609 = self.head;
                            var $610 = self.tail;
                            return (() => {
                                var self = $609;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $611 = self.name;
                                        var $612 = self.term;
                                        var $613 = self.type;
                                        var $614 = self.done;
                                        return Fm$Term$lam($611)((x$12 => Fm$Term$desugar_cse$argument(name$1)($610)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.all':
                var $615 = self.eras;
                var $616 = self.self;
                var $617 = self.name;
                var $618 = self.xtyp;
                var $619 = self.body;
                return Fm$Term$lam(String$flatten(List$cons(name$1)(List$cons(Fm$Name$read("."))(List$cons($617)(List$nil)))))((x$11 => Fm$Term$desugar_cse$argument(name$1)(wyth$2)($619(Fm$Term$var($616)(0n))(Fm$Term$var($617)(0n)))(body$4)(defs$5)));
            case 'Fm.Term.lam':
                var $620 = self.name;
                var $621 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $622 = self.head;
                            var $623 = self.tail;
                            return (() => {
                                var self = $622;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $624 = self.name;
                                        var $625 = self.term;
                                        var $626 = self.type;
                                        var $627 = self.done;
                                        return Fm$Term$lam($624)((x$14 => Fm$Term$desugar_cse$argument(name$1)($623)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $628 = self.func;
                var $629 = self.argm;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $630 = self.head;
                            var $631 = self.tail;
                            return (() => {
                                var self = $630;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $632 = self.name;
                                        var $633 = self.term;
                                        var $634 = self.type;
                                        var $635 = self.done;
                                        return Fm$Term$lam($632)((x$14 => Fm$Term$desugar_cse$argument(name$1)($631)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.let':
                var $636 = self.name;
                var $637 = self.expr;
                var $638 = self.body;
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
                                        return Fm$Term$lam($641)((x$15 => Fm$Term$desugar_cse$argument(name$1)($640)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.def':
                var $645 = self.name;
                var $646 = self.expr;
                var $647 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $648 = self.head;
                            var $649 = self.tail;
                            return (() => {
                                var self = $648;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $650 = self.name;
                                        var $651 = self.term;
                                        var $652 = self.type;
                                        var $653 = self.done;
                                        return Fm$Term$lam($650)((x$15 => Fm$Term$desugar_cse$argument(name$1)($649)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ann':
                var $654 = self.done;
                var $655 = self.term;
                var $656 = self.type;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $657 = self.head;
                            var $658 = self.tail;
                            return (() => {
                                var self = $657;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $659 = self.name;
                                        var $660 = self.term;
                                        var $661 = self.type;
                                        var $662 = self.done;
                                        return Fm$Term$lam($659)((x$15 => Fm$Term$desugar_cse$argument(name$1)($658)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.gol':
                var $663 = self.name;
                var $664 = self.dref;
                var $665 = self.verb;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $666 = self.head;
                            var $667 = self.tail;
                            return (() => {
                                var self = $666;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $668 = self.name;
                                        var $669 = self.term;
                                        var $670 = self.type;
                                        var $671 = self.done;
                                        return Fm$Term$lam($668)((x$15 => Fm$Term$desugar_cse$argument(name$1)($667)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.hol':
                var $672 = self.path;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $673 = self.head;
                            var $674 = self.tail;
                            return (() => {
                                var self = $673;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $675 = self.name;
                                        var $676 = self.term;
                                        var $677 = self.type;
                                        var $678 = self.done;
                                        return Fm$Term$lam($675)((x$13 => Fm$Term$desugar_cse$argument(name$1)($674)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.nat':
                var $679 = self.natx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $680 = self.head;
                            var $681 = self.tail;
                            return (() => {
                                var self = $680;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $682 = self.name;
                                        var $683 = self.term;
                                        var $684 = self.type;
                                        var $685 = self.done;
                                        return Fm$Term$lam($682)((x$13 => Fm$Term$desugar_cse$argument(name$1)($681)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.chr':
                var $686 = self.chrx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $687 = self.head;
                            var $688 = self.tail;
                            return (() => {
                                var self = $687;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $689 = self.name;
                                        var $690 = self.term;
                                        var $691 = self.type;
                                        var $692 = self.done;
                                        return Fm$Term$lam($689)((x$13 => Fm$Term$desugar_cse$argument(name$1)($688)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.str':
                var $693 = self.strx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $694 = self.head;
                            var $695 = self.tail;
                            return (() => {
                                var self = $694;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $696 = self.name;
                                        var $697 = self.term;
                                        var $698 = self.type;
                                        var $699 = self.done;
                                        return Fm$Term$lam($696)((x$13 => Fm$Term$desugar_cse$argument(name$1)($695)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.sug':
                var $700 = self.sugx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $701 = self.head;
                            var $702 = self.tail;
                            return (() => {
                                var self = $701;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $703 = self.name;
                                        var $704 = self.term;
                                        var $705 = self.type;
                                        var $706 = self.done;
                                        return Fm$Term$lam($703)((x$13 => Fm$Term$desugar_cse$argument(name$1)($702)(type$3)(body$4)(defs$5)));
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
                var $707 = self.value;
                return Maybe$some($707);
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
                        var $708 = self.name;
                        var $709 = self.indx;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $710 = self.name;
                                        var $711 = self.term;
                                        var $712 = self.type;
                                        var $713 = self.done;
                                        return $711;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.ref':
                        var $714 = self.name;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $715 = self.name;
                                        var $716 = self.term;
                                        var $717 = self.type;
                                        var $718 = self.done;
                                        return $716;
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
                                        var $719 = self.name;
                                        var $720 = self.term;
                                        var $721 = self.type;
                                        var $722 = self.done;
                                        return $720;
                                }
                            })())))));
                            return expr$8
                        })();
                    case 'Fm.Term.all':
                        var $723 = self.eras;
                        var $724 = self.self;
                        var $725 = self.name;
                        var $726 = self.xtyp;
                        var $727 = self.body;
                        return (() => {
                            var got$13 = Maybe$or(Fm$get($725)(cses$4))(Fm$get("_")(cses$4));
                            return (() => {
                                var self = got$13;
                                switch (self._) {
                                    case 'Maybe.none':
                                        return (() => {
                                            var expr$14 = (list_for(wyth$3)(expr$1)((def$14 => (expr$15 => (() => {
                                                var self = def$14;
                                                switch (self._) {
                                                    case 'Fm.Def.new':
                                                        var $728 = self.name;
                                                        var $729 = self.term;
                                                        var $730 = self.type;
                                                        var $731 = self.done;
                                                        return Fm$Term$app(expr$15)($729);
                                                }
                                            })()))));
                                            return expr$14
                                        })();
                                    case 'Maybe.some':
                                        var $732 = self.value;
                                        return (() => {
                                            var argm$15 = Fm$Term$desugar_cse$argument(name$2)(wyth$3)($726)($732)(defs$6);
                                            var expr$16 = Fm$Term$app(expr$1)(argm$15);
                                            var type$17 = $727(Fm$Term$var($724)(0n))(Fm$Term$var($725)(0n));
                                            return Fm$Term$desugar_cse$cases(expr$16)(name$2)(wyth$3)(cses$4)(type$17)(defs$6)(ctxt$7)
                                        })();
                                }
                            })()
                        })();
                    case 'Fm.Term.lam':
                        var $733 = self.name;
                        var $734 = self.body;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $735 = self.name;
                                        var $736 = self.term;
                                        var $737 = self.type;
                                        var $738 = self.done;
                                        return $736;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.app':
                        var $739 = self.func;
                        var $740 = self.argm;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $741 = self.name;
                                        var $742 = self.term;
                                        var $743 = self.type;
                                        var $744 = self.done;
                                        return $742;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.let':
                        var $745 = self.name;
                        var $746 = self.expr;
                        var $747 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $748 = self.name;
                                        var $749 = self.term;
                                        var $750 = self.type;
                                        var $751 = self.done;
                                        return $749;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.def':
                        var $752 = self.name;
                        var $753 = self.expr;
                        var $754 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $755 = self.name;
                                        var $756 = self.term;
                                        var $757 = self.type;
                                        var $758 = self.done;
                                        return $756;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.ann':
                        var $759 = self.done;
                        var $760 = self.term;
                        var $761 = self.type;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $762 = self.name;
                                        var $763 = self.term;
                                        var $764 = self.type;
                                        var $765 = self.done;
                                        return $763;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.gol':
                        var $766 = self.name;
                        var $767 = self.dref;
                        var $768 = self.verb;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $769 = self.name;
                                        var $770 = self.term;
                                        var $771 = self.type;
                                        var $772 = self.done;
                                        return $770;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.hol':
                        var $773 = self.path;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $774 = self.name;
                                        var $775 = self.term;
                                        var $776 = self.type;
                                        var $777 = self.done;
                                        return $775;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.nat':
                        var $778 = self.natx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $779 = self.name;
                                        var $780 = self.term;
                                        var $781 = self.type;
                                        var $782 = self.done;
                                        return $780;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.chr':
                        var $783 = self.chrx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $784 = self.name;
                                        var $785 = self.term;
                                        var $786 = self.type;
                                        var $787 = self.done;
                                        return $785;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.str':
                        var $788 = self.strx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $789 = self.name;
                                        var $790 = self.term;
                                        var $791 = self.type;
                                        var $792 = self.done;
                                        return $790;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.sug':
                        var $793 = self.sugx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $794 = self.name;
                                        var $795 = self.term;
                                        var $796 = self.type;
                                        var $797 = self.done;
                                        return $795;
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
                var $798 = self.name;
                var $799 = self.indx;
                return Maybe$none;
            case 'Fm.Term.ref':
                var $800 = self.name;
                return Maybe$none;
            case 'Fm.Term.typ':
                return Maybe$none;
            case 'Fm.Term.all':
                var $801 = self.eras;
                var $802 = self.self;
                var $803 = self.name;
                var $804 = self.xtyp;
                var $805 = self.body;
                return (() => {
                    var moti$14 = Fm$Term$desugar_cse$motive(with$3)(moti$5);
                    var argm$15 = Fm$Term$desugar_cse$argument(name$2)(List$nil)($804)(moti$14)(defs$7);
                    var expr$16 = Fm$Term$app(expr$1)(argm$15);
                    var type$17 = $805(Fm$Term$var($802)(0n))(Fm$Term$var($803)(0n));
                    return Maybe$some(Fm$Term$desugar_cse$cases(expr$16)(name$2)(with$3)(cses$4)(type$17)(defs$7)(ctxt$8))
                })();
            case 'Fm.Term.lam':
                var $806 = self.name;
                var $807 = self.body;
                return Maybe$none;
            case 'Fm.Term.app':
                var $808 = self.func;
                var $809 = self.argm;
                return Maybe$none;
            case 'Fm.Term.let':
                var $810 = self.name;
                var $811 = self.expr;
                var $812 = self.body;
                return Maybe$none;
            case 'Fm.Term.def':
                var $813 = self.name;
                var $814 = self.expr;
                var $815 = self.body;
                return Maybe$none;
            case 'Fm.Term.ann':
                var $816 = self.done;
                var $817 = self.term;
                var $818 = self.type;
                return Maybe$none;
            case 'Fm.Term.gol':
                var $819 = self.name;
                var $820 = self.dref;
                var $821 = self.verb;
                return Maybe$none;
            case 'Fm.Term.hol':
                var $822 = self.path;
                return Maybe$none;
            case 'Fm.Term.nat':
                var $823 = self.natx;
                return Maybe$none;
            case 'Fm.Term.chr':
                var $824 = self.chrx;
                return Maybe$none;
            case 'Fm.Term.str':
                var $825 = self.strx;
                return Maybe$none;
            case 'Fm.Term.sug':
                var $826 = self.sugx;
                return Maybe$none;
        }
    })()))))))));
    var Fm$Term$serialize$go = (term$1 => (depth$2 => (init$3 => (x$4 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $827 = self.name;
                var $828 = self.indx;
                return (() => {
                    var self = ($828 >= init$3);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits(Nat$pred((depth$2 - $828 <= 0n ? 0n : depth$2 - $828)))));
                                return Bits$0(Bits$0(Bits$1(name$7(x$4))))
                            })();
                        case 'false':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits($828)));
                                return Bits$0(Bits$1(Bits$0(name$7(x$4))))
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $829 = self.name;
                return (() => {
                    var name$6 = a1 => (a1 + (fm_name_to_bits($829)));
                    return Bits$0(Bits$0(Bits$0(name$6(x$4))))
                })();
            case 'Fm.Term.typ':
                return Bits$0(Bits$1(Bits$1(x$4)));
            case 'Fm.Term.all':
                var $830 = self.eras;
                var $831 = self.self;
                var $832 = self.name;
                var $833 = self.xtyp;
                var $834 = self.body;
                return (() => {
                    var self$10 = a1 => (a1 + (fm_name_to_bits($831)));
                    var xtyp$11 = Fm$Term$serialize$go($833)(depth$2)(init$3);
                    var body$12 = Fm$Term$serialize$go($834(Fm$Term$var($831)(depth$2))(Fm$Term$var($832)(Nat$succ(depth$2))))(Nat$succ(Nat$succ(depth$2)))(init$3);
                    return Bits$1(Bits$0(Bits$0(self$10(xtyp$11(body$12(x$4))))))
                })();
            case 'Fm.Term.lam':
                var $835 = self.name;
                var $836 = self.body;
                return (() => {
                    var body$7 = Fm$Term$serialize$go($836(Fm$Term$var($835)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return Bits$1(Bits$0(Bits$1(body$7(x$4))))
                })();
            case 'Fm.Term.app':
                var $837 = self.func;
                var $838 = self.argm;
                return (() => {
                    var func$7 = Fm$Term$serialize$go($837)(depth$2)(init$3);
                    var argm$8 = Fm$Term$serialize$go($838)(depth$2)(init$3);
                    return Bits$1(Bits$1(Bits$0(func$7(argm$8(x$4)))))
                })();
            case 'Fm.Term.let':
                var $839 = self.name;
                var $840 = self.expr;
                var $841 = self.body;
                return (() => {
                    var expr$8 = Fm$Term$serialize$go($840)(depth$2)(init$3);
                    var body$9 = Fm$Term$serialize$go($841(Fm$Term$var($839)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return Bits$1(Bits$1(Bits$1(expr$8(body$9(x$4)))))
                })();
            case 'Fm.Term.def':
                var $842 = self.name;
                var $843 = self.expr;
                var $844 = self.body;
                return Fm$Term$serialize$go($844($843))(depth$2)(init$3)(x$4);
            case 'Fm.Term.ann':
                var $845 = self.done;
                var $846 = self.term;
                var $847 = self.type;
                return Fm$Term$serialize$go($846)(depth$2)(init$3)(x$4);
            case 'Fm.Term.gol':
                var $848 = self.name;
                var $849 = self.dref;
                var $850 = self.verb;
                return (() => {
                    var name$8 = a1 => (a1 + (fm_name_to_bits($848)));
                    return Bits$0(Bits$0(Bits$0(name$8(x$4))))
                })();
            case 'Fm.Term.hol':
                var $851 = self.path;
                return x$4;
            case 'Fm.Term.nat':
                var $852 = self.natx;
                return x$4;
            case 'Fm.Term.chr':
                var $853 = self.chrx;
                return x$4;
            case 'Fm.Term.str':
                var $854 = self.strx;
                return x$4;
            case 'Fm.Term.sug':
                var $855 = self.sugx;
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
                                    var $856 = self.slice(0, -1);
                                    return Bool$false;
                                case '1':
                                    var $857 = self.slice(0, -1);
                                    return Bool$false;
                            }
                        })();
                    case '0':
                        var $858 = self.slice(0, -1);
                        return (() => {
                            var self = b$2;
                            switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                case 'nil':
                                    return Bool$false;
                                case '0':
                                    var $859 = self.slice(0, -1);
                                    return Bits$eql($858)($859);
                                case '1':
                                    var $860 = self.slice(0, -1);
                                    return Bool$false;
                            }
                        })();
                    case '1':
                        var $861 = self.slice(0, -1);
                        return (() => {
                            var self = b$2;
                            switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                case 'nil':
                                    return Bool$false;
                                case '0':
                                    var $862 = self.slice(0, -1);
                                    return Bool$false;
                                case '1':
                                    var $863 = self.slice(0, -1);
                                    return Bits$eql($861)($863);
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
                var $864 = self.value;
                return Bool$true;
        }
    })()));
    var Fm$Term$normalize = (term$1 => (defs$2 => (() => {
        var self = Fm$Term$reduce(term$1)(defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $865 = self.name;
                var $866 = self.indx;
                return Fm$Term$var($865)($866);
            case 'Fm.Term.ref':
                var $867 = self.name;
                return Fm$Term$ref($867);
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $868 = self.eras;
                var $869 = self.self;
                var $870 = self.name;
                var $871 = self.xtyp;
                var $872 = self.body;
                return Fm$Term$all($868)($869)($870)(Fm$Term$normalize($871)(defs$2))((s$8 => (x$9 => Fm$Term$normalize($872(s$8)(x$9))(defs$2))));
            case 'Fm.Term.lam':
                var $873 = self.name;
                var $874 = self.body;
                return Fm$Term$lam($873)((x$5 => Fm$Term$normalize($874(x$5))(defs$2)));
            case 'Fm.Term.app':
                var $875 = self.func;
                var $876 = self.argm;
                return Fm$Term$app(Fm$Term$normalize($875)(defs$2))(Fm$Term$normalize($876)(defs$2));
            case 'Fm.Term.let':
                var $877 = self.name;
                var $878 = self.expr;
                var $879 = self.body;
                return Fm$Term$let($877)(Fm$Term$normalize($878)(defs$2))((x$6 => Fm$Term$normalize($879(x$6))(defs$2)));
            case 'Fm.Term.def':
                var $880 = self.name;
                var $881 = self.expr;
                var $882 = self.body;
                return Fm$Term$def($880)(Fm$Term$normalize($881)(defs$2))((x$6 => Fm$Term$normalize($882(x$6))(defs$2)));
            case 'Fm.Term.ann':
                var $883 = self.done;
                var $884 = self.term;
                var $885 = self.type;
                return Fm$Term$ann($883)(Fm$Term$normalize($884)(defs$2))(Fm$Term$normalize($885)(defs$2));
            case 'Fm.Term.gol':
                var $886 = self.name;
                var $887 = self.dref;
                var $888 = self.verb;
                return Fm$Term$gol($886)($887)($888);
            case 'Fm.Term.hol':
                var $889 = self.path;
                return Fm$Term$hol($889);
            case 'Fm.Term.nat':
                var $890 = self.natx;
                return Fm$Term$nat($890);
            case 'Fm.Term.chr':
                var $891 = self.chrx;
                return Fm$Term$chr($891);
            case 'Fm.Term.str':
                var $892 = self.strx;
                return Fm$Term$str($892);
            case 'Fm.Term.sug':
                var $893 = self.sugx;
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
                                var $894 = self.name;
                                var $895 = self.indx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $896 = self.name;
                                            var $897 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $898 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $899 = self.eras;
                                            var $900 = self.self;
                                            var $901 = self.name;
                                            var $902 = self.xtyp;
                                            var $903 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $904 = self.name;
                                            var $905 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $906 = self.func;
                                            var $907 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $908 = self.name;
                                            var $909 = self.expr;
                                            var $910 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $911 = self.name;
                                            var $912 = self.expr;
                                            var $913 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $914 = self.done;
                                            var $915 = self.term;
                                            var $916 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $917 = self.name;
                                            var $918 = self.dref;
                                            var $919 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $920 = self.path;
                                            return Fm$Term$equal$patch($920)(a$1);
                                        case 'Fm.Term.nat':
                                            var $921 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $922 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $923 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $924 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ref':
                                var $925 = self.name;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $926 = self.name;
                                            var $927 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $928 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $929 = self.eras;
                                            var $930 = self.self;
                                            var $931 = self.name;
                                            var $932 = self.xtyp;
                                            var $933 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $934 = self.name;
                                            var $935 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $936 = self.func;
                                            var $937 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $938 = self.name;
                                            var $939 = self.expr;
                                            var $940 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $941 = self.name;
                                            var $942 = self.expr;
                                            var $943 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $944 = self.done;
                                            var $945 = self.term;
                                            var $946 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $947 = self.name;
                                            var $948 = self.dref;
                                            var $949 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $950 = self.path;
                                            return Fm$Term$equal$patch($950)(a$1);
                                        case 'Fm.Term.nat':
                                            var $951 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $952 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $953 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $954 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.typ':
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $955 = self.name;
                                            var $956 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $957 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $958 = self.eras;
                                            var $959 = self.self;
                                            var $960 = self.name;
                                            var $961 = self.xtyp;
                                            var $962 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $963 = self.name;
                                            var $964 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $965 = self.func;
                                            var $966 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $967 = self.name;
                                            var $968 = self.expr;
                                            var $969 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $970 = self.name;
                                            var $971 = self.expr;
                                            var $972 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $973 = self.done;
                                            var $974 = self.term;
                                            var $975 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $976 = self.name;
                                            var $977 = self.dref;
                                            var $978 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $979 = self.path;
                                            return Fm$Term$equal$patch($979)(a$1);
                                        case 'Fm.Term.nat':
                                            var $980 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $981 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $982 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $983 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.all':
                                var $984 = self.eras;
                                var $985 = self.self;
                                var $986 = self.name;
                                var $987 = self.xtyp;
                                var $988 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $989 = self.name;
                                            var $990 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $991 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $992 = self.eras;
                                            var $993 = self.self;
                                            var $994 = self.name;
                                            var $995 = self.xtyp;
                                            var $996 = self.body;
                                            return (() => {
                                                var seen$21 = Set$set(id$10)(seen$5);
                                                var a1_body$22 = $988(Fm$Term$var($985)(lv$4))(Fm$Term$var($986)(Nat$succ(lv$4)));
                                                var b1_body$23 = $996(Fm$Term$var($993)(lv$4))(Fm$Term$var($994)(Nat$succ(lv$4)));
                                                var eq_self$24 = ($985 === $993);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($987)($995)(defs$3)(lv$4)(seen$21))((eq_type$25 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$22)(b1_body$23)(defs$3)(Nat$succ(Nat$succ(lv$4)))(seen$21))((eq_body$26 => Monad$pure(Fm$Check$monad)((eq_self$24 && (eq_type$25 && eq_body$26)))))))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $997 = self.name;
                                            var $998 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $999 = self.func;
                                            var $1000 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1001 = self.name;
                                            var $1002 = self.expr;
                                            var $1003 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1004 = self.name;
                                            var $1005 = self.expr;
                                            var $1006 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1007 = self.done;
                                            var $1008 = self.term;
                                            var $1009 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1010 = self.name;
                                            var $1011 = self.dref;
                                            var $1012 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1013 = self.path;
                                            return Fm$Term$equal$patch($1013)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1014 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1015 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1016 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1017 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.lam':
                                var $1018 = self.name;
                                var $1019 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1020 = self.name;
                                            var $1021 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1022 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1023 = self.eras;
                                            var $1024 = self.self;
                                            var $1025 = self.name;
                                            var $1026 = self.xtyp;
                                            var $1027 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1028 = self.name;
                                            var $1029 = self.body;
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                var a1_body$16 = $1019(Fm$Term$var($1018)(lv$4));
                                                var b1_body$17 = $1029(Fm$Term$var($1028)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$16)(b1_body$17)(defs$3)(Nat$succ(lv$4))(seen$15))((eq_body$18 => Monad$pure(Fm$Check$monad)(eq_body$18)))
                                            })();
                                        case 'Fm.Term.app':
                                            var $1030 = self.func;
                                            var $1031 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1032 = self.name;
                                            var $1033 = self.expr;
                                            var $1034 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1035 = self.name;
                                            var $1036 = self.expr;
                                            var $1037 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1038 = self.done;
                                            var $1039 = self.term;
                                            var $1040 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1041 = self.name;
                                            var $1042 = self.dref;
                                            var $1043 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1044 = self.path;
                                            return Fm$Term$equal$patch($1044)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1045 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1046 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1047 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1048 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.app':
                                var $1049 = self.func;
                                var $1050 = self.argm;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1051 = self.name;
                                            var $1052 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1053 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1054 = self.eras;
                                            var $1055 = self.self;
                                            var $1056 = self.name;
                                            var $1057 = self.xtyp;
                                            var $1058 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1059 = self.name;
                                            var $1060 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1061 = self.func;
                                            var $1062 = self.argm;
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1049)($1061)(defs$3)(lv$4)(seen$15))((eq_func$16 => Monad$bind(Fm$Check$monad)(Fm$Term$equal($1050)($1062)(defs$3)(lv$4)(seen$15))((eq_argm$17 => Monad$pure(Fm$Check$monad)((eq_func$16 && eq_argm$17))))))
                                            })();
                                        case 'Fm.Term.let':
                                            var $1063 = self.name;
                                            var $1064 = self.expr;
                                            var $1065 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1066 = self.name;
                                            var $1067 = self.expr;
                                            var $1068 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1069 = self.done;
                                            var $1070 = self.term;
                                            var $1071 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1072 = self.name;
                                            var $1073 = self.dref;
                                            var $1074 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1075 = self.path;
                                            return Fm$Term$equal$patch($1075)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1076 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1077 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1078 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1079 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.let':
                                var $1080 = self.name;
                                var $1081 = self.expr;
                                var $1082 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1083 = self.name;
                                            var $1084 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1085 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1086 = self.eras;
                                            var $1087 = self.self;
                                            var $1088 = self.name;
                                            var $1089 = self.xtyp;
                                            var $1090 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1091 = self.name;
                                            var $1092 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1093 = self.func;
                                            var $1094 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1095 = self.name;
                                            var $1096 = self.expr;
                                            var $1097 = self.body;
                                            return (() => {
                                                var seen$17 = Set$set(id$10)(seen$5);
                                                var a1_body$18 = $1082(Fm$Term$var($1080)(lv$4));
                                                var b1_body$19 = $1097(Fm$Term$var($1095)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1081)($1096)(defs$3)(lv$4)(seen$17))((eq_expr$20 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$18)(b1_body$19)(defs$3)(Nat$succ(lv$4))(seen$17))((eq_body$21 => Monad$pure(Fm$Check$monad)((eq_expr$20 && eq_body$21))))))
                                            })();
                                        case 'Fm.Term.def':
                                            var $1098 = self.name;
                                            var $1099 = self.expr;
                                            var $1100 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1101 = self.done;
                                            var $1102 = self.term;
                                            var $1103 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1104 = self.name;
                                            var $1105 = self.dref;
                                            var $1106 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1107 = self.path;
                                            return Fm$Term$equal$patch($1107)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1108 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1109 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1110 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1111 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.def':
                                var $1112 = self.name;
                                var $1113 = self.expr;
                                var $1114 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1115 = self.name;
                                            var $1116 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1117 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1118 = self.eras;
                                            var $1119 = self.self;
                                            var $1120 = self.name;
                                            var $1121 = self.xtyp;
                                            var $1122 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1123 = self.name;
                                            var $1124 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1125 = self.func;
                                            var $1126 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1127 = self.name;
                                            var $1128 = self.expr;
                                            var $1129 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1130 = self.name;
                                            var $1131 = self.expr;
                                            var $1132 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1133 = self.done;
                                            var $1134 = self.term;
                                            var $1135 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1136 = self.name;
                                            var $1137 = self.dref;
                                            var $1138 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1139 = self.path;
                                            return Fm$Term$equal$patch($1139)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1140 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1141 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1142 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1143 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ann':
                                var $1144 = self.done;
                                var $1145 = self.term;
                                var $1146 = self.type;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1147 = self.name;
                                            var $1148 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1149 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1150 = self.eras;
                                            var $1151 = self.self;
                                            var $1152 = self.name;
                                            var $1153 = self.xtyp;
                                            var $1154 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1155 = self.name;
                                            var $1156 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1157 = self.func;
                                            var $1158 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1159 = self.name;
                                            var $1160 = self.expr;
                                            var $1161 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1162 = self.name;
                                            var $1163 = self.expr;
                                            var $1164 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1165 = self.done;
                                            var $1166 = self.term;
                                            var $1167 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1168 = self.name;
                                            var $1169 = self.dref;
                                            var $1170 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1171 = self.path;
                                            return Fm$Term$equal$patch($1171)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1172 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1173 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1174 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1175 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.gol':
                                var $1176 = self.name;
                                var $1177 = self.dref;
                                var $1178 = self.verb;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1179 = self.name;
                                            var $1180 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1181 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1182 = self.eras;
                                            var $1183 = self.self;
                                            var $1184 = self.name;
                                            var $1185 = self.xtyp;
                                            var $1186 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1187 = self.name;
                                            var $1188 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1189 = self.func;
                                            var $1190 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1191 = self.name;
                                            var $1192 = self.expr;
                                            var $1193 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1194 = self.name;
                                            var $1195 = self.expr;
                                            var $1196 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1197 = self.done;
                                            var $1198 = self.term;
                                            var $1199 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1200 = self.name;
                                            var $1201 = self.dref;
                                            var $1202 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1203 = self.path;
                                            return Fm$Term$equal$patch($1203)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1204 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1205 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1206 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1207 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.hol':
                                var $1208 = self.path;
                                return Fm$Term$equal$patch($1208)(b$2);
                            case 'Fm.Term.nat':
                                var $1209 = self.natx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1210 = self.name;
                                            var $1211 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1212 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1213 = self.eras;
                                            var $1214 = self.self;
                                            var $1215 = self.name;
                                            var $1216 = self.xtyp;
                                            var $1217 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1218 = self.name;
                                            var $1219 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1220 = self.func;
                                            var $1221 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1222 = self.name;
                                            var $1223 = self.expr;
                                            var $1224 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1225 = self.name;
                                            var $1226 = self.expr;
                                            var $1227 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1228 = self.done;
                                            var $1229 = self.term;
                                            var $1230 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1231 = self.name;
                                            var $1232 = self.dref;
                                            var $1233 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1234 = self.path;
                                            return Fm$Term$equal$patch($1234)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1235 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1236 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1237 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1238 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.chr':
                                var $1239 = self.chrx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1240 = self.name;
                                            var $1241 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1242 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1243 = self.eras;
                                            var $1244 = self.self;
                                            var $1245 = self.name;
                                            var $1246 = self.xtyp;
                                            var $1247 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1248 = self.name;
                                            var $1249 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1250 = self.func;
                                            var $1251 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1252 = self.name;
                                            var $1253 = self.expr;
                                            var $1254 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1255 = self.name;
                                            var $1256 = self.expr;
                                            var $1257 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1258 = self.done;
                                            var $1259 = self.term;
                                            var $1260 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1261 = self.name;
                                            var $1262 = self.dref;
                                            var $1263 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1264 = self.path;
                                            return Fm$Term$equal$patch($1264)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1265 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1266 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1267 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1268 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.str':
                                var $1269 = self.strx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1270 = self.name;
                                            var $1271 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1272 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1273 = self.eras;
                                            var $1274 = self.self;
                                            var $1275 = self.name;
                                            var $1276 = self.xtyp;
                                            var $1277 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1278 = self.name;
                                            var $1279 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1280 = self.func;
                                            var $1281 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1282 = self.name;
                                            var $1283 = self.expr;
                                            var $1284 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1285 = self.name;
                                            var $1286 = self.expr;
                                            var $1287 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1288 = self.done;
                                            var $1289 = self.term;
                                            var $1290 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1291 = self.name;
                                            var $1292 = self.dref;
                                            var $1293 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1294 = self.path;
                                            return Fm$Term$equal$patch($1294)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1295 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1296 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1297 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1298 = self.sugx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.sug':
                                var $1299 = self.sugx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1300 = self.name;
                                            var $1301 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1302 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1303 = self.eras;
                                            var $1304 = self.self;
                                            var $1305 = self.name;
                                            var $1306 = self.xtyp;
                                            var $1307 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1308 = self.name;
                                            var $1309 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1310 = self.func;
                                            var $1311 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1312 = self.name;
                                            var $1313 = self.expr;
                                            var $1314 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1315 = self.name;
                                            var $1316 = self.expr;
                                            var $1317 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1318 = self.done;
                                            var $1319 = self.term;
                                            var $1320 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1321 = self.name;
                                            var $1322 = self.dref;
                                            var $1323 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1324 = self.path;
                                            return Fm$Term$equal$patch($1324)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1325 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1326 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1327 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.sug':
                                            var $1328 = self.sugx;
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
                var $1329 = self.name;
                var $1330 = self.indx;
                return (() => {
                    var self = List$at_last($1330)(ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$undefined_reference($1329))(List$nil));
                        case 'Maybe.some':
                            var $1331 = self.value;
                            return Fm$Check$result(Maybe$some(Pair$snd($1331)))(List$nil);
                    }
                })();
            case 'Fm.Term.ref':
                var $1332 = self.name;
                return (() => {
                    var self = Fm$get($1332)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$undefined_reference($1332))(List$nil));
                        case 'Maybe.some':
                            var $1333 = self.value;
                            return (() => {
                                var self = $1333;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1334 = self.name;
                                        var $1335 = self.term;
                                        var $1336 = self.type;
                                        var $1337 = self.done;
                                        return Fm$Check$result(Maybe$some($1336))(List$nil);
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return Fm$Check$result(Maybe$some(Fm$Term$typ))(List$nil);
            case 'Fm.Term.all':
                var $1338 = self.eras;
                var $1339 = self.self;
                var $1340 = self.name;
                var $1341 = self.xtyp;
                var $1342 = self.body;
                return (() => {
                    var ctx_size$11 = List$length(ctx$4);
                    var self_var$12 = Fm$Term$var($1339)(ctx_size$11);
                    var body_var$13 = Fm$Term$var($1340)(Nat$succ(ctx_size$11));
                    var body_ctx$14 = List$cons(Pair$new($1340)($1341))(List$cons(Pair$new($1339)(term$1))(ctx$4));
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1341)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($15 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1342(self_var$12)(body_var$13))(Maybe$some(Fm$Term$typ))(defs$3)(body_ctx$14)(Fm$MPath$1(path$5)))(($16 => Monad$pure(Fm$Check$monad)(Fm$Term$typ)))))
                })();
            case 'Fm.Term.lam':
                var $1343 = self.name;
                var $1344 = self.body;
                return (() => {
                    var self = type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                        case 'Maybe.some':
                            var $1345 = self.value;
                            return (() => {
                                var typv$9 = Fm$Term$reduce($1345)(defs$3);
                                return (() => {
                                    var self = typv$9;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1346 = self.name;
                                            var $1347 = self.indx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.ref':
                                            var $1348 = self.name;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.typ':
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.all':
                                            var $1349 = self.eras;
                                            var $1350 = self.self;
                                            var $1351 = self.name;
                                            var $1352 = self.xtyp;
                                            var $1353 = self.body;
                                            return (() => {
                                                var ctx_size$15 = List$length(ctx$4);
                                                var self_var$16 = term$1;
                                                var body_var$17 = Fm$Term$var($1343)(ctx_size$15);
                                                var body_typ$18 = $1353(self_var$16)(body_var$17);
                                                var body_ctx$19 = List$cons(Pair$new($1343)($1352))(ctx$4);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1344(body_var$17))(Maybe$some(body_typ$18))(defs$3)(body_ctx$19)(Fm$MPath$0(path$5)))(($20 => Monad$pure(Fm$Check$monad)($1345)))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $1354 = self.name;
                                            var $1355 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.app':
                                            var $1356 = self.func;
                                            var $1357 = self.argm;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.let':
                                            var $1358 = self.name;
                                            var $1359 = self.expr;
                                            var $1360 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.def':
                                            var $1361 = self.name;
                                            var $1362 = self.expr;
                                            var $1363 = self.body;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.ann':
                                            var $1364 = self.done;
                                            var $1365 = self.term;
                                            var $1366 = self.type;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.gol':
                                            var $1367 = self.name;
                                            var $1368 = self.dref;
                                            var $1369 = self.verb;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.hol':
                                            var $1370 = self.path;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.nat':
                                            var $1371 = self.natx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.chr':
                                            var $1372 = self.chrx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.str':
                                            var $1373 = self.strx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                        case 'Fm.Term.sug':
                                            var $1374 = self.sugx;
                                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right($1345))(ctx$4))(List$nil));
                                    }
                                })()
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $1375 = self.func;
                var $1376 = self.argm;
                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1375)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((func_typ$8 => (() => {
                    var func_typ$9 = Fm$Term$reduce(func_typ$8)(defs$3);
                    return (() => {
                        var self = func_typ$9;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $1377 = self.name;
                                var $1378 = self.indx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.ref':
                                var $1379 = self.name;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.typ':
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.all':
                                var $1380 = self.eras;
                                var $1381 = self.self;
                                var $1382 = self.name;
                                var $1383 = self.xtyp;
                                var $1384 = self.body;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1376)(Maybe$some($1383))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($15 => Monad$pure(Fm$Check$monad)($1384($1375)($1376))));
                            case 'Fm.Term.lam':
                                var $1385 = self.name;
                                var $1386 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.app':
                                var $1387 = self.func;
                                var $1388 = self.argm;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.let':
                                var $1389 = self.name;
                                var $1390 = self.expr;
                                var $1391 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.def':
                                var $1392 = self.name;
                                var $1393 = self.expr;
                                var $1394 = self.body;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.ann':
                                var $1395 = self.done;
                                var $1396 = self.term;
                                var $1397 = self.type;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.gol':
                                var $1398 = self.name;
                                var $1399 = self.dref;
                                var $1400 = self.verb;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.hol':
                                var $1401 = self.path;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.nat':
                                var $1402 = self.natx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.chr':
                                var $1403 = self.chrx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.str':
                                var $1404 = self.strx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                            case 'Fm.Term.sug':
                                var $1405 = self.sugx;
                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$left("Function"))(Either$right(func_typ$9))(ctx$4))(List$nil));
                        }
                    })()
                })()));
            case 'Fm.Term.let':
                var $1406 = self.name;
                var $1407 = self.expr;
                var $1408 = self.body;
                return (() => {
                    var ctx_size$9 = List$length(ctx$4);
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1407)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((expr_typ$10 => (() => {
                        var body_val$11 = $1408(Fm$Term$var($1406)(ctx_size$9));
                        var body_ctx$12 = List$cons(Pair$new($1406)(expr_typ$10))(ctx$4);
                        return Monad$bind(Fm$Check$monad)(Fm$Term$check(body_val$11)(type$2)(defs$3)(body_ctx$12)(Fm$MPath$1(path$5)))((body_typ$13 => Monad$pure(Fm$Check$monad)(body_typ$13)))
                    })()))
                })();
            case 'Fm.Term.def':
                var $1409 = self.name;
                var $1410 = self.expr;
                var $1411 = self.body;
                return Fm$Term$check($1411($1410))(type$2)(defs$3)(ctx$4)(path$5);
            case 'Fm.Term.ann':
                var $1412 = self.done;
                var $1413 = self.term;
                var $1414 = self.type;
                return (() => {
                    var self = $1412;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1414);
                        case 'false':
                            return Monad$bind(Fm$Check$monad)(Fm$Term$check($1413)(Maybe$some($1414))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($9 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1414)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($10 => Monad$pure(Fm$Check$monad)($1414)))));
                    }
                })();
            case 'Fm.Term.gol':
                var $1415 = self.name;
                var $1416 = self.dref;
                var $1417 = self.verb;
                return Fm$Check$result(type$2)(List$cons(Fm$Error$show_goal($1415)($1416)($1417)(type$2)(ctx$4))(List$nil));
            case 'Fm.Term.hol':
                var $1418 = self.path;
                return Fm$Check$result(type$2)(List$nil);
            case 'Fm.Term.nat':
                var $1419 = self.natx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Nat"));
            case 'Fm.Term.chr':
                var $1420 = self.chrx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Char"));
            case 'Fm.Term.str':
                var $1421 = self.strx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("String"));
            case 'Fm.Term.sug':
                var $1422 = self.sugx;
                return (() => {
                    var self = $1422;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $1423 = self.func;
                            var $1424 = self.args;
                            return (() => {
                                var expr$9 = $1423;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check(expr$9)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((etyp$10 => (() => {
                                    var dsug$11 = Fm$Term$desugar_app($1423)($1424)(etyp$10)(defs$3);
                                    return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$patch(Fm$MPath$to_bits(path$5))(dsug$11))(List$nil))
                                })()))
                            })();
                        case 'Fm.Sugar.cse':
                            var $1425 = self.expr;
                            var $1426 = self.name;
                            var $1427 = self.with;
                            var $1428 = self.cses;
                            var $1429 = self.moti;
                            return (() => {
                                var expr$12 = $1425;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check(expr$12)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((etyp$13 => (() => {
                                    var dsug$14 = Fm$Term$desugar_cse($1425)($1426)($1427)($1428)($1429)(etyp$13)(defs$3)(ctx$4);
                                    return (() => {
                                        var self = dsug$14;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                                            case 'Maybe.some':
                                                var $1430 = self.value;
                                                return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$patch(Fm$MPath$to_bits(path$5))($1430))(List$nil));
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
                var $1431 = self.value;
                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1431)(infr$6)(defs$3)(List$length(ctx$4))(Set$new))((eqls$8 => (() => {
                    var self = eqls$8;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1431);
                        case 'false':
                            return Fm$Check$result(Maybe$none)(List$cons(Fm$Error$type_mismatch(Either$right($1431))(Either$right(infr$6))(ctx$4))(List$nil));
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
                var $1432 = self.name;
                var $1433 = self.indx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1434 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1435 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.ref':
                var $1436 = self.name;
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
            case 'Fm.Term.typ':
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1439 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1440 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.all':
                var $1441 = self.eras;
                var $1442 = self.self;
                var $1443 = self.name;
                var $1444 = self.xtyp;
                var $1445 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1446 = self.slice(0, -1);
                            return Fm$Term$all($1441)($1442)($1443)(Fm$Term$patch_at($1446)($1444)(fn$3))($1445);
                        case '1':
                            var $1447 = self.slice(0, -1);
                            return Fm$Term$all($1441)($1442)($1443)($1444)((s$10 => (x$11 => Fm$Term$patch_at($1447)($1445(s$10)(x$11))(fn$3))));
                    }
                })();
            case 'Fm.Term.lam':
                var $1448 = self.name;
                var $1449 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1450 = self.slice(0, -1);
                            return Fm$Term$lam($1448)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1449(x$7))(fn$3)));
                        case '1':
                            var $1451 = self.slice(0, -1);
                            return Fm$Term$lam($1448)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1449(x$7))(fn$3)));
                    }
                })();
            case 'Fm.Term.app':
                var $1452 = self.func;
                var $1453 = self.argm;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1454 = self.slice(0, -1);
                            return Fm$Term$app(Fm$Term$patch_at($1454)($1452)(fn$3))($1453);
                        case '1':
                            var $1455 = self.slice(0, -1);
                            return Fm$Term$app($1452)(Fm$Term$patch_at($1455)($1453)(fn$3));
                    }
                })();
            case 'Fm.Term.let':
                var $1456 = self.name;
                var $1457 = self.expr;
                var $1458 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1459 = self.slice(0, -1);
                            return Fm$Term$let($1456)(Fm$Term$patch_at($1459)($1457)(fn$3))($1458);
                        case '1':
                            var $1460 = self.slice(0, -1);
                            return Fm$Term$let($1456)($1457)((x$8 => Fm$Term$patch_at($1460)($1458(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.def':
                var $1461 = self.name;
                var $1462 = self.expr;
                var $1463 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1464 = self.slice(0, -1);
                            return Fm$Term$def($1461)(Fm$Term$patch_at($1464)($1462)(fn$3))($1463);
                        case '1':
                            var $1465 = self.slice(0, -1);
                            return Fm$Term$def($1461)($1462)((x$8 => Fm$Term$patch_at($1465)($1463(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.ann':
                var $1466 = self.done;
                var $1467 = self.term;
                var $1468 = self.type;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1469 = self.slice(0, -1);
                            return Fm$Term$ann($1466)(Fm$Term$patch_at(path$1)($1467)(fn$3))($1468);
                        case '1':
                            var $1470 = self.slice(0, -1);
                            return Fm$Term$ann($1466)(Fm$Term$patch_at(path$1)($1467)(fn$3))($1468);
                    }
                })();
            case 'Fm.Term.gol':
                var $1471 = self.name;
                var $1472 = self.dref;
                var $1473 = self.verb;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1474 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1475 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.hol':
                var $1476 = self.path;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1477 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1478 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.nat':
                var $1479 = self.natx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1480 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1481 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.chr':
                var $1482 = self.chrx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1483 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1484 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.str':
                var $1485 = self.strx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1486 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1487 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.sug':
                var $1488 = self.sugx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1489 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1490 = self.slice(0, -1);
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
                        var $1491 = self.head;
                        var $1492 = self.tail;
                        return (() => {
                            var self = $1491;
                            switch (self._) {
                                case 'Fm.Error.type_mismatch':
                                    var $1493 = self.expected;
                                    var $1494 = self.detected;
                                    var $1495 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1492)(fixs$5);
                                case 'Fm.Error.show_goal':
                                    var $1496 = self.name;
                                    var $1497 = self.dref;
                                    var $1498 = self.verb;
                                    var $1499 = self.goal;
                                    var $1500 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1492)(fixs$5);
                                case 'Fm.Error.patch':
                                    var $1501 = self.path;
                                    var $1502 = self.term;
                                    return (() => {
                                        var self = $1501;
                                        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                            case 'nil':
                                                return Maybe$none;
                                            case '0':
                                                var $1503 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_term$11 = Fm$Term$patch_at($1503)(term$1)((x$11 => $1502));
                                                    return Fm$synth$fix(patched_term$11)(type$2)(defs$3)($1492)(Bool$true)
                                                })();
                                            case '1':
                                                var $1504 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_type$11 = Fm$Term$patch_at($1504)(type$2)((x$11 => $1502));
                                                    return Fm$synth$fix(term$1)(patched_type$11)(defs$3)($1492)(Bool$true)
                                                })();
                                        }
                                    })();
                                case 'Fm.Error.undefined_reference':
                                    var $1505 = self.name;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1492)(fixs$5);
                                case 'Fm.Error.cant_infer':
                                    var $1506 = self.term;
                                    var $1507 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1492)(fixs$5);
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
                    var $1508 = self.value;
                    var $1509 = self.errors;
                    return (() => {
                        var self = $1509;
                        switch (self._) {
                            case 'List.nil':
                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                            case 'List.cons':
                                var $1510 = self.head;
                                var $1511 = self.tail;
                                return (() => {
                                    var fixed$11 = Fm$synth$fix(term$2)(type$3)(defs$4)($1509)(Bool$false);
                                    return (() => {
                                        var self = fixed$11;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                                            case 'Maybe.some':
                                                var $1512 = self.value;
                                                return (() => {
                                                    var self = $1512;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $1513 = self.fst;
                                                            var $1514 = self.snd;
                                                            return (() => {
                                                                var term$15 = Fm$Term$bind(List$nil)(Fm$Path$0(Fm$Path$nil))($1513);
                                                                var type$16 = Fm$Term$bind(List$nil)(Fm$Path$1(Fm$Path$nil))($1514);
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
                    var $1515 = self.fst;
                    var $1516 = self.snd;
                    return (() => {
                        var self = $1516;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $1517 = self.name;
                                var $1518 = self.term;
                                var $1519 = self.type;
                                var $1520 = self.done;
                                return (() => {
                                    var name$10 = Fm$Name$from_bits($1515);
                                    var term$11 = $1518;
                                    var type$12 = $1519;
                                    var done$13 = $1520;
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
    var Bits$to_nat = (b$1 => (() => {
        var self = b$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return 0n;
            case '0':
                var $1521 = self.slice(0, -1);
                return (2n * Bits$to_nat($1521));
            case '1':
                var $1522 = self.slice(0, -1);
                return Nat$succ((2n * Bits$to_nat($1522)));
        }
    })());
    var String$join$go = (sep$1 => (list$2 => (fst$3 => (() => {
        var self = list$2;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1523 = self.head;
                var $1524 = self.tail;
                return String$flatten(List$cons((() => {
                    var self = fst$3;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return "";
                        case 'false':
                            return sep$1;
                    }
                })())(List$cons($1523)(List$cons(String$join$go(sep$1)($1524)(Bool$false))(List$nil))));
        }
    })())));
    var String$join = (sep$1 => (list$2 => String$join$go(sep$1)(list$2)(Bool$true)));
    var Pair$fst = (pair$3 => (() => {
        var self = pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1525 = self.fst;
                var $1526 = self.snd;
                return $1525;
        }
    })());
    var Fm$Term$show$go = (term$1 => (path$2 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1527 = self.name;
                var $1528 = self.indx;
                return Fm$Name$show($1527);
            case 'Fm.Term.ref':
                var $1529 = self.name;
                return (() => {
                    var name$4 = Fm$Name$show($1529);
                    return (() => {
                        var self = path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                return name$4;
                            case 'Maybe.some':
                                var $1530 = self.value;
                                return (() => {
                                    var path_val$6 = (Bits$1(Bits$nil) + Fm$Path$to_bits($1530));
                                    var path_str$7 = Nat$show(Bits$to_nat(path_val$6));
                                    return String$flatten(List$cons(name$4)(List$cons("\u{1b}[2m-")(List$cons(path_str$7)(List$cons("\u{1b}[0m")(List$nil)))))
                                })();
                        }
                    })()
                })();
            case 'Fm.Term.typ':
                return "Type";
            case 'Fm.Term.all':
                var $1531 = self.eras;
                var $1532 = self.self;
                var $1533 = self.name;
                var $1534 = self.xtyp;
                var $1535 = self.body;
                return (() => {
                    var eras$8 = $1531;
                    var self$9 = Fm$Name$show($1532);
                    var name$10 = Fm$Name$show($1533);
                    var type$11 = Fm$Term$show$go($1534)(Fm$MPath$0(path$2));
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
                    var body$14 = Fm$Term$show$go($1535(Fm$Term$var($1532)(0n))(Fm$Term$var($1533)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons(self$9)(List$cons(open$12)(List$cons(name$10)(List$cons(":")(List$cons(type$11)(List$cons(clos$13)(List$cons(" ")(List$cons(body$14)(List$nil)))))))))
                })();
            case 'Fm.Term.lam':
                var $1536 = self.name;
                var $1537 = self.body;
                return (() => {
                    var name$5 = Fm$Name$show($1536);
                    var body$6 = Fm$Term$show$go($1537(Fm$Term$var($1536)(0n)))(Fm$MPath$0(path$2));
                    return String$flatten(List$cons("(")(List$cons(name$5)(List$cons(") ")(List$cons(body$6)(List$nil)))))
                })();
            case 'Fm.Term.app':
                var $1538 = self.func;
                var $1539 = self.argm;
                return (() => {
                    var func$5 = Fm$Term$show$go($1538)(Fm$MPath$0(path$2));
                    var argm$6 = Fm$Term$show$go($1539)(Fm$MPath$1(path$2));
                    var wrap$7 = (() => {
                        var self = func$5;
                        switch (self.length === 0 ? 'nil' : 'cons') {
                            case 'nil':
                                return Bool$false;
                            case 'cons':
                                var $1540 = self.charCodeAt(0);
                                var $1541 = self.slice(1);
                                return ($1540 === 40);
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
                var $1542 = self.name;
                var $1543 = self.expr;
                var $1544 = self.body;
                return (() => {
                    var name$6 = Fm$Name$show($1542);
                    var expr$7 = Fm$Term$show$go($1543)(Fm$MPath$0(path$2));
                    var body$8 = Fm$Term$show$go($1544(Fm$Term$var($1542)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons("let ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                })();
            case 'Fm.Term.def':
                var $1545 = self.name;
                var $1546 = self.expr;
                var $1547 = self.body;
                return (() => {
                    var name$6 = Fm$Name$show($1545);
                    var expr$7 = Fm$Term$show$go($1546)(Fm$MPath$0(path$2));
                    var body$8 = Fm$Term$show$go($1547(Fm$Term$var($1545)(0n)))(Fm$MPath$1(path$2));
                    return String$flatten(List$cons("def ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                })();
            case 'Fm.Term.ann':
                var $1548 = self.done;
                var $1549 = self.term;
                var $1550 = self.type;
                return (() => {
                    var term$6 = Fm$Term$show$go($1549)(Fm$MPath$0(path$2));
                    var type$7 = Fm$Term$show$go($1550)(Fm$MPath$1(path$2));
                    return String$flatten(List$cons(term$6)(List$cons("::")(List$cons(type$7)(List$nil))))
                })();
            case 'Fm.Term.gol':
                var $1551 = self.name;
                var $1552 = self.dref;
                var $1553 = self.verb;
                return (() => {
                    var name$6 = Fm$Name$show($1551);
                    return String$flatten(List$cons("?")(List$cons(name$6)(List$nil)))
                })();
            case 'Fm.Term.hol':
                var $1554 = self.path;
                return "_";
            case 'Fm.Term.nat':
                var $1555 = self.natx;
                return String$flatten(List$cons(Nat$show($1555))(List$nil));
            case 'Fm.Term.chr':
                var $1556 = self.chrx;
                return String$cons($1556)(String$nil);
            case 'Fm.Term.str':
                var $1557 = self.strx;
                return String$flatten(List$cons("\"")(List$cons($1557)(List$cons("\"")(List$nil))));
            case 'Fm.Term.sug':
                var $1558 = self.sugx;
                return (() => {
                    var self = $1558;
                    switch (self._) {
                        case 'Fm.Sugar.app':
                            var $1559 = self.func;
                            var $1560 = self.args;
                            return (() => {
                                var func$6 = Fm$Term$show$go($1559)(Fm$MPath$0(path$2));
                                var args$7 = Map$to_list($1560);
                                var args$8 = List$mapped(args$7)((x$8 => (() => {
                                    var self = x$8;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $1561 = self.fst;
                                            var $1562 = self.snd;
                                            return String$flatten(List$cons(Fm$Name$show(Fm$Name$from_bits($1561)))(List$cons(": ")(List$cons(Fm$Term$show$go($1562)(Maybe$none))(List$nil))));
                                    }
                                })()));
                                var args$9 = String$join(", ")(args$8);
                                var wrap$10 = (() => {
                                    var self = func$6;
                                    switch (self.length === 0 ? 'nil' : 'cons') {
                                        case 'nil':
                                            return Bool$false;
                                        case 'cons':
                                            var $1563 = self.charCodeAt(0);
                                            var $1564 = self.slice(1);
                                            return ($1563 === 40);
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
                            var $1565 = self.expr;
                            var $1566 = self.name;
                            var $1567 = self.with;
                            var $1568 = self.cses;
                            var $1569 = self.moti;
                            return (() => {
                                var expr$9 = Fm$Term$show$go($1565)(Fm$MPath$0(path$2));
                                var name$10 = Fm$Name$show($1566);
                                var with$11 = String$join("")(List$mapped($1567)((def$11 => (() => {
                                    var self = def$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1570 = self.name;
                                            var $1571 = self.term;
                                            var $1572 = self.type;
                                            var $1573 = self.done;
                                            return (() => {
                                                var name$16 = Fm$Name$show($1570);
                                                var type$17 = Fm$Term$show$go($1572)(Maybe$none);
                                                var term$18 = Fm$Term$show$go($1571)(Maybe$none);
                                                return String$flatten(List$cons(name$16)(List$cons(": ")(List$cons(type$17)(List$cons(" = ")(List$cons(term$18)(List$cons(";")(List$nil)))))))
                                            })();
                                    }
                                })())));
                                var cses$12 = Map$to_list($1568);
                                var cses$13 = String$join("")(List$mapped(cses$12)((x$13 => (() => {
                                    var name$14 = Fm$Name$show(Fm$Name$from_bits(Pair$fst(x$13)));
                                    var term$15 = Fm$Term$show$go(Pair$snd(x$13))(Maybe$none);
                                    return String$flatten(List$cons(name$14)(List$cons(": ")(List$cons(term$15)(List$cons("; ")(List$nil)))))
                                })())));
                                var moti$14 = Fm$Term$show$go($1569)(Maybe$none);
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
                var $1574 = self.charCodeAt(0);
                var $1575 = self.slice(1);
                return Bool$false;
        }
    })());
    var Fm$Context$show = (context$1 => (() => {
        var self = context$1;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1576 = self.head;
                var $1577 = self.tail;
                return (() => {
                    var self = $1576;
                    switch (self._) {
                        case 'Pair.new':
                            var $1578 = self.fst;
                            var $1579 = self.snd;
                            return (() => {
                                var name$6 = Fm$Name$show($1578);
                                var type$7 = Fm$Term$show($1579);
                                var rest$8 = Fm$Context$show($1577);
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
                var $1580 = self.name;
                var $1581 = self.indx;
                return term$4;
            case 'Fm.Term.ref':
                var $1582 = self.name;
                return (() => {
                    var self = Fm$get($1582)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($1582);
                        case 'Maybe.some':
                            var $1583 = self.value;
                            return (() => {
                                var self = $1583;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1584 = self.name;
                                        var $1585 = self.term;
                                        var $1586 = self.type;
                                        var $1587 = self.done;
                                        return $1585;
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$4;
            case 'Fm.Term.all':
                var $1588 = self.eras;
                var $1589 = self.self;
                var $1590 = self.name;
                var $1591 = self.xtyp;
                var $1592 = self.body;
                return term$4;
            case 'Fm.Term.lam':
                var $1593 = self.name;
                var $1594 = self.body;
                return term$4;
            case 'Fm.Term.app':
                var $1595 = self.func;
                var $1596 = self.argm;
                return term$4;
            case 'Fm.Term.let':
                var $1597 = self.name;
                var $1598 = self.expr;
                var $1599 = self.body;
                return term$4;
            case 'Fm.Term.def':
                var $1600 = self.name;
                var $1601 = self.expr;
                var $1602 = self.body;
                return term$4;
            case 'Fm.Term.ann':
                var $1603 = self.done;
                var $1604 = self.term;
                var $1605 = self.type;
                return term$4;
            case 'Fm.Term.gol':
                var $1606 = self.name;
                var $1607 = self.dref;
                var $1608 = self.verb;
                return term$4;
            case 'Fm.Term.hol':
                var $1609 = self.path;
                return term$4;
            case 'Fm.Term.nat':
                var $1610 = self.natx;
                return term$4;
            case 'Fm.Term.chr':
                var $1611 = self.chrx;
                return term$4;
            case 'Fm.Term.str':
                var $1612 = self.strx;
                return term$4;
            case 'Fm.Term.sug':
                var $1613 = self.sugx;
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
                var $1614 = self.expected;
                var $1615 = self.detected;
                var $1616 = self.context;
                return (() => {
                    var expected$6 = (() => {
                        var self = $1614;
                        switch (self._) {
                            case 'Either.left':
                                var $1617 = self.value;
                                return $1617;
                            case 'Either.right':
                                var $1618 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1618)(Map$new));
                        }
                    })();
                    var detected$7 = (() => {
                        var self = $1615;
                        switch (self._) {
                            case 'Either.left':
                                var $1619 = self.value;
                                return $1619;
                            case 'Either.right':
                                var $1620 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1620)(Map$new));
                        }
                    })();
                    var context$8 = Fm$Context$show($1616);
                    return String$flatten(List$cons("Type mismatch.\u{a}")(List$cons("- Expected: ")(List$cons(expected$6)(List$cons("\u{a}")(List$cons("- Detected: ")(List$cons(detected$7)(List$cons("\u{a}")(List$cons("With context:\u{a}")(List$cons(context$8)(List$nil))))))))))
                })();
            case 'Fm.Error.show_goal':
                var $1621 = self.name;
                var $1622 = self.dref;
                var $1623 = self.verb;
                var $1624 = self.goal;
                var $1625 = self.context;
                return (() => {
                    var goal_name$8 = String$flatten(List$cons("Goal ?")(List$cons(Fm$Name$show($1621))(List$cons(":\u{a}")(List$nil))));
                    var with_type$9 = (() => {
                        var self = $1624;
                        switch (self._) {
                            case 'Maybe.none':
                                return "";
                            case 'Maybe.some':
                                var $1626 = self.value;
                                return (() => {
                                    var goal$10 = Fm$Term$expand($1622)($1626)(defs$2);
                                    return String$flatten(List$cons("With type: ")(List$cons((() => {
                                        var self = $1623;
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
                    var with_ctxt$10 = String$flatten(List$cons("With ctxt:\u{a}")(List$cons(Fm$Context$show($1625))(List$nil)));
                    return String$flatten(List$cons(goal_name$8)(List$cons(with_type$9)(List$cons(with_ctxt$10)(List$nil))))
                })();
            case 'Fm.Error.patch':
                var $1627 = self.path;
                var $1628 = self.term;
                return String$flatten(List$cons("Patching: ")(List$cons(Fm$Term$show($1628))(List$nil)));
            case 'Fm.Error.undefined_reference':
                var $1629 = self.name;
                return String$flatten(List$cons("Undefined reference: ")(List$cons(Fm$Name$show($1629))(List$nil)));
            case 'Fm.Error.cant_infer':
                var $1630 = self.term;
                var $1631 = self.context;
                return (() => {
                    var term$5 = Fm$Term$show($1630);
                    var context$6 = Fm$Context$show($1631);
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
                    var $1632 = self.fst;
                    var $1633 = self.snd;
                    return (() => {
                        var self = def$3;
                        switch (self._) {
                            case 'Pair.new':
                                var $1634 = self.fst;
                                var $1635 = self.snd;
                                return (() => {
                                    var self = $1635;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1636 = self.name;
                                            var $1637 = self.term;
                                            var $1638 = self.type;
                                            var $1639 = self.done;
                                            return (() => {
                                                var name$13 = Fm$Name$from_bits($1634);
                                                var term$14 = $1637;
                                                var type$15 = $1638;
                                                var check$16 = Fm$Term$check(term$14)(Maybe$some(type$15))(defs$1)(List$nil)(Fm$MPath$nil);
                                                return (() => {
                                                    var self = check$16;
                                                    switch (self._) {
                                                        case 'Fm.Check.result':
                                                            var $1640 = self.value;
                                                            var $1641 = self.errors;
                                                            return (() => {
                                                                var self = $1641;
                                                                switch (self._) {
                                                                    case 'List.nil':
                                                                        return (() => {
                                                                            var name_str$19 = Fm$Name$show(name$13);
                                                                            var type_str$20 = Fm$Term$show(type$15);
                                                                            var term_str$21 = Fm$Term$show(term$14);
                                                                            var string_0$22 = String$flatten(List$cons($1632)(List$cons(name_str$19)(List$cons(": ")(List$cons(type_str$20)(List$cons("\u{a}")(List$nil))))));
                                                                            var string_1$23 = $1633;
                                                                            return Pair$new(string_0$22)(string_1$23)
                                                                        })();
                                                                    case 'List.cons':
                                                                        var $1642 = self.head;
                                                                        var $1643 = self.tail;
                                                                        return (() => {
                                                                            var name_str$21 = Fm$Name$show(name$13);
                                                                            var type_str$22 = "<error>";
                                                                            var string_0$23 = String$flatten(List$cons($1632)(List$cons(name_str$21)(List$cons(": ")(List$cons(type_str$22)(List$cons("\u{a}")(List$nil))))));
                                                                            var string_1$24 = $1633;
                                                                            var string_1$25 = (list_for($1641)(string_1$24)((error$25 => (string_1$26 => String$flatten(List$cons(string_1$26)(List$cons(Fm$Error$show(error$25)(defs$1))(List$cons("\u{a}")(List$nil))))))));
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
                    var $1644 = self.fst;
                    var $1645 = self.snd;
                    return String$flatten(List$cons("\u{a}# Types:\u{a}\u{a}")(List$cons($1644)(List$cons("\u{a}")(List$cons((() => {
                        var self = $1645;
                        switch (self.length === 0 ? 'nil' : 'cons') {
                            case 'nil':
                                return "";
                            case 'cons':
                                var $1646 = self.charCodeAt(0);
                                var $1647 = self.slice(1);
                                return String$flatten(List$cons("# Errors:\u{a}\u{a}")(List$cons($1645)(List$nil)));
                        }
                    })())(List$nil)))));
            }
        })()
    })());
    var IO$print = (text$1 => IO$ask("print")(text$1)((skip$2 => IO$end(Unit$new))));
    var Maybe$bind = (m$3 => (f$4 => (() => {
        var self = m$3;
        switch (self._) {
            case 'Maybe.none':
                return Maybe$none;
            case 'Maybe.some':
                var $1648 = self.value;
                return f$4($1648);
        }
    })()));
    var Maybe$monad = Monad$new(Maybe$bind)(Maybe$some);
    var Fm$Comp$var = (name$1 => ({
        _: 'Fm.Comp.var',
        'name': name$1
    }));
    var Fm$Comp$ref = (name$1 => ({
        _: 'Fm.Comp.ref',
        'name': name$1
    }));
    var Fm$Comp$nil = ({
        _: 'Fm.Comp.nil'
    });
    var Fm$Comp$lam = (name$1 => (body$2 => ({
        _: 'Fm.Comp.lam',
        'name': name$1,
        'body': body$2
    })));
    var Fm$Prim$chr = ({
        _: 'Fm.Prim.chr'
    });
    var Fm$Prim$str = ({
        _: 'Fm.Prim.str'
    });
    var Fm$Prim$nat = ({
        _: 'Fm.Prim.nat'
    });
    var Fm$Comp$prims = List$cons(Pair$new(Fm$Term$ref("Char"))(Fm$Prim$chr))(List$cons(Pair$new(Fm$Term$ref("String"))(Fm$Prim$str))(List$cons(Pair$new(Fm$Term$ref("Nat"))(Fm$Prim$nat))(List$nil)));
    var Fm$Check$value = (chk$2 => (() => {
        var self = chk$2;
        switch (self._) {
            case 'Fm.Check.result':
                var $1649 = self.value;
                var $1650 = self.errors;
                return $1649;
        }
    })());
    var Fm$Comp$prim_of = (type$1 => (defs$2 => List$fold(Fm$Comp$prims)(Maybe$none)((name_prim$3 => (res$4 => (() => {
        var self = name_prim$3;
        switch (self._) {
            case 'Pair.new':
                var $1651 = self.fst;
                var $1652 = self.snd;
                return (() => {
                    var expr$7 = $1651;
                    var prim$8 = $1652;
                    var iseq$9 = Fm$Term$equal(type$1)(expr$7)(defs$2)(0n)(Set$new);
                    var iseq$10 = Maybe$to_bool(Fm$Check$value(iseq$9));
                    return (() => {
                        var self = iseq$10;
                        switch (self ? 'true' : 'false') {
                            case 'true':
                                return Maybe$some(prim$8);
                            case 'false':
                                return res$4;
                        }
                    })()
                })();
        }
    })())))));
    var Fm$Comp$ins = (prim$1 => (expr$2 => ({
        _: 'Fm.Comp.ins',
        'prim': prim$1,
        'expr': expr$2
    })));
    var Fm$Comp$eli = (prim$1 => (expr$2 => ({
        _: 'Fm.Comp.eli',
        'prim': prim$1,
        'expr': expr$2
    })));
    var Fm$Comp$app = (func$1 => (argm$2 => ({
        _: 'Fm.Comp.app',
        'func': func$1,
        'argm': argm$2
    })));
    var Fm$Comp$let = (name$1 => (expr$2 => (body$3 => ({
        _: 'Fm.Comp.let',
        'name': name$1,
        'expr': expr$2,
        'body': body$3
    }))));
    var Fm$Comp$compile = (term$1 => (type$2 => (defs$3 => (ctx$4 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1653 = self.name;
                var $1654 = self.indx;
                return Monad$pure(Maybe$monad)(Fm$Comp$var($1653));
            case 'Fm.Term.ref':
                var $1655 = self.name;
                return Monad$pure(Maybe$monad)(Fm$Comp$ref($1655));
            case 'Fm.Term.typ':
                return Monad$pure(Maybe$monad)(Fm$Comp$nil);
            case 'Fm.Term.all':
                var $1656 = self.eras;
                var $1657 = self.self;
                var $1658 = self.name;
                var $1659 = self.xtyp;
                var $1660 = self.body;
                return Monad$pure(Maybe$monad)(Fm$Comp$nil);
            case 'Fm.Term.lam':
                var $1661 = self.name;
                var $1662 = self.body;
                return (() => {
                    var self = type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            return Maybe$none;
                        case 'Maybe.some':
                            var $1663 = self.value;
                            return (() => {
                                var typv$8 = Fm$Term$reduce($1663)(defs$3);
                                return (() => {
                                    var self = typv$8;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1664 = self.name;
                                            var $1665 = self.indx;
                                            return Maybe$none;
                                        case 'Fm.Term.ref':
                                            var $1666 = self.name;
                                            return Maybe$none;
                                        case 'Fm.Term.typ':
                                            return Maybe$none;
                                        case 'Fm.Term.all':
                                            var $1667 = self.eras;
                                            var $1668 = self.self;
                                            var $1669 = self.name;
                                            var $1670 = self.xtyp;
                                            var $1671 = self.body;
                                            return (() => {
                                                var ctx_size$14 = List$length(ctx$4);
                                                var self_var$15 = term$1;
                                                var body_var$16 = Fm$Term$var($1661)(ctx_size$14);
                                                var body_typ$17 = $1671(self_var$15)(body_var$16);
                                                var body_ctx$18 = List$cons(Pair$new($1661)($1670))(ctx$4);
                                                return Monad$bind(Maybe$monad)(Fm$Comp$compile($1662(body_var$16))(Maybe$some(body_typ$17))(defs$3)(body_ctx$18))((body_cmp$19 => (() => {
                                                    var term_cmp$20 = Fm$Comp$lam($1661)(body_cmp$19);
                                                    var term_cmp$21 = (() => {
                                                        var self = Fm$Comp$prim_of($1663)(defs$3);
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                return term_cmp$20;
                                                            case 'Maybe.some':
                                                                var $1672 = self.value;
                                                                return Fm$Comp$ins($1672)(term_cmp$20);
                                                        }
                                                    })();
                                                    return Monad$pure(Maybe$monad)(term_cmp$21)
                                                })()))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $1673 = self.name;
                                            var $1674 = self.body;
                                            return Maybe$none;
                                        case 'Fm.Term.app':
                                            var $1675 = self.func;
                                            var $1676 = self.argm;
                                            return Maybe$none;
                                        case 'Fm.Term.let':
                                            var $1677 = self.name;
                                            var $1678 = self.expr;
                                            var $1679 = self.body;
                                            return Maybe$none;
                                        case 'Fm.Term.def':
                                            var $1680 = self.name;
                                            var $1681 = self.expr;
                                            var $1682 = self.body;
                                            return Maybe$none;
                                        case 'Fm.Term.ann':
                                            var $1683 = self.done;
                                            var $1684 = self.term;
                                            var $1685 = self.type;
                                            return Maybe$none;
                                        case 'Fm.Term.gol':
                                            var $1686 = self.name;
                                            var $1687 = self.dref;
                                            var $1688 = self.verb;
                                            return Maybe$none;
                                        case 'Fm.Term.hol':
                                            var $1689 = self.path;
                                            return Maybe$none;
                                        case 'Fm.Term.nat':
                                            var $1690 = self.natx;
                                            return Maybe$none;
                                        case 'Fm.Term.chr':
                                            var $1691 = self.chrx;
                                            return Maybe$none;
                                        case 'Fm.Term.str':
                                            var $1692 = self.strx;
                                            return Maybe$none;
                                        case 'Fm.Term.sug':
                                            var $1693 = self.sugx;
                                            return Maybe$none;
                                    }
                                })()
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $1694 = self.func;
                var $1695 = self.argm;
                return Monad$bind(Maybe$monad)(Fm$Check$value(Fm$Term$check($1694)(Maybe$none)(defs$3)(ctx$4)(Maybe$none)))((func_typ$7 => (() => {
                    var func_typ$8 = Fm$Term$reduce(func_typ$7)(defs$3);
                    return (() => {
                        var self = func_typ$8;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $1696 = self.name;
                                var $1697 = self.indx;
                                return Maybe$none;
                            case 'Fm.Term.ref':
                                var $1698 = self.name;
                                return Maybe$none;
                            case 'Fm.Term.typ':
                                return Maybe$none;
                            case 'Fm.Term.all':
                                var $1699 = self.eras;
                                var $1700 = self.self;
                                var $1701 = self.name;
                                var $1702 = self.xtyp;
                                var $1703 = self.body;
                                return Monad$bind(Maybe$monad)(Fm$Comp$compile($1694)(Maybe$none)(defs$3)(ctx$4))((func_cmp$14 => Monad$bind(Maybe$monad)(Fm$Comp$compile($1695)(Maybe$some($1702))(defs$3)(ctx$4))((argm_cmp$15 => (() => {
                                    var func_cmp$16 = (() => {
                                        var self = Fm$Comp$prim_of(func_typ$8)(defs$3);
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return func_cmp$14;
                                            case 'Maybe.some':
                                                var $1704 = self.value;
                                                return Fm$Comp$eli($1704)(func_cmp$14);
                                        }
                                    })();
                                    return Monad$pure(Maybe$monad)(Fm$Comp$app(func_cmp$16)(argm_cmp$15))
                                })()))));
                            case 'Fm.Term.lam':
                                var $1705 = self.name;
                                var $1706 = self.body;
                                return Maybe$none;
                            case 'Fm.Term.app':
                                var $1707 = self.func;
                                var $1708 = self.argm;
                                return Maybe$none;
                            case 'Fm.Term.let':
                                var $1709 = self.name;
                                var $1710 = self.expr;
                                var $1711 = self.body;
                                return Maybe$none;
                            case 'Fm.Term.def':
                                var $1712 = self.name;
                                var $1713 = self.expr;
                                var $1714 = self.body;
                                return Maybe$none;
                            case 'Fm.Term.ann':
                                var $1715 = self.done;
                                var $1716 = self.term;
                                var $1717 = self.type;
                                return Maybe$none;
                            case 'Fm.Term.gol':
                                var $1718 = self.name;
                                var $1719 = self.dref;
                                var $1720 = self.verb;
                                return Maybe$none;
                            case 'Fm.Term.hol':
                                var $1721 = self.path;
                                return Maybe$none;
                            case 'Fm.Term.nat':
                                var $1722 = self.natx;
                                return Maybe$none;
                            case 'Fm.Term.chr':
                                var $1723 = self.chrx;
                                return Maybe$none;
                            case 'Fm.Term.str':
                                var $1724 = self.strx;
                                return Maybe$none;
                            case 'Fm.Term.sug':
                                var $1725 = self.sugx;
                                return Maybe$none;
                        }
                    })()
                })()));
            case 'Fm.Term.let':
                var $1726 = self.name;
                var $1727 = self.expr;
                var $1728 = self.body;
                return (() => {
                    var ctx_size$8 = List$length(ctx$4);
                    return Monad$bind(Maybe$monad)(Fm$Check$value(Fm$Term$check($1727)(Maybe$none)(defs$3)(ctx$4)(Maybe$none)))((expr_typ$9 => Monad$bind(Maybe$monad)(Fm$Comp$compile($1727)(Maybe$none)(defs$3)(ctx$4))((expr_cmp$10 => (() => {
                        var body_val$11 = $1728(Fm$Term$var($1726)(ctx_size$8));
                        var body_ctx$12 = List$cons(Pair$new($1726)(expr_typ$9))(ctx$4);
                        return Monad$bind(Maybe$monad)(Fm$Comp$compile(body_val$11)(type$2)(defs$3)(body_ctx$12))((body_cmp$13 => Monad$pure(Maybe$monad)(Fm$Comp$let($1726)(body_cmp$13)(expr_cmp$10))))
                    })()))))
                })();
            case 'Fm.Term.def':
                var $1729 = self.name;
                var $1730 = self.expr;
                var $1731 = self.body;
                return Fm$Comp$compile($1731($1730))(type$2)(defs$3)(ctx$4);
            case 'Fm.Term.ann':
                var $1732 = self.done;
                var $1733 = self.term;
                var $1734 = self.type;
                return Fm$Comp$compile($1733)(Maybe$some($1734))(defs$3)(ctx$4);
            case 'Fm.Term.gol':
                var $1735 = self.name;
                var $1736 = self.dref;
                var $1737 = self.verb;
                return Monad$pure(Maybe$monad)(Fm$Comp$nil);
            case 'Fm.Term.hol':
                var $1738 = self.path;
                return Monad$pure(Maybe$monad)(Fm$Comp$nil);
            case 'Fm.Term.nat':
                var $1739 = self.natx;
                return Fm$Comp$compile(Fm$Term$unroll_nat($1739))(type$2)(defs$3)(ctx$4);
            case 'Fm.Term.chr':
                var $1740 = self.chrx;
                return Fm$Comp$compile(Fm$Term$unroll_chr($1740))(type$2)(defs$3)(ctx$4);
            case 'Fm.Term.str':
                var $1741 = self.strx;
                return Fm$Comp$compile(Fm$Term$unroll_str($1741))(type$2)(defs$3)(ctx$4);
            case 'Fm.Term.sug':
                var $1742 = self.sugx;
                return Maybe$none;
        }
    })()))));
    var Fm$Comp$js = (comp$1 => (() => {
        var self = comp$1;
        switch (self._) {
            case 'Fm.Comp.nil':
                return "null";
            case 'Fm.Comp.var':
                var $1743 = self.name;
                return Fm$Name$show($1743);
            case 'Fm.Comp.ref':
                var $1744 = self.name;
                return Fm$Name$show($1744);
            case 'Fm.Comp.lam':
                var $1745 = self.name;
                var $1746 = self.body;
                return String$flatten(List$cons("((")(List$cons(Fm$Name$show($1745))(List$cons(")=>")(List$cons(Fm$Comp$js($1746))(List$cons(")")(List$nil))))));
            case 'Fm.Comp.app':
                var $1747 = self.func;
                var $1748 = self.argm;
                return String$flatten(List$cons(Fm$Comp$js($1747))(List$cons("(")(List$cons(Fm$Comp$js($1748))(List$cons(")")(List$nil)))));
            case 'Fm.Comp.let':
                var $1749 = self.name;
                var $1750 = self.expr;
                var $1751 = self.body;
                return String$flatten(List$cons("((")(List$cons(Fm$Name$show($1749))(List$cons(")=>")(List$cons(Fm$Comp$js($1751))(List$cons(")")(List$cons("(")(List$cons(Fm$Comp$js($1750))(List$cons(")")(List$nil)))))))));
            case 'Fm.Comp.eli':
                var $1752 = self.prim;
                var $1753 = self.expr;
                return String$flatten(List$cons("{eli}")(List$cons(Fm$Comp$js($1753))(List$nil)));
            case 'Fm.Comp.ins':
                var $1754 = self.prim;
                var $1755 = self.expr;
                return String$flatten(List$cons("{ins}")(List$cons(Fm$Comp$js($1755))(List$nil)));
        }
    })());
    var Fm$Comp$js$defs = (defs$1 => (() => {
        var list$2 = Map$to_list(defs$1);
        var code$3 = "";
        var code$4 = (list_for(list$2)(code$3)((def$4 => (code$5 => (() => {
            var self = def$4;
            switch (self._) {
                case 'Pair.new':
                    var $1756 = self.fst;
                    var $1757 = self.snd;
                    return (() => {
                        var self = $1757;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $1758 = self.name;
                                var $1759 = self.term;
                                var $1760 = self.type;
                                var $1761 = self.done;
                                return (() => {
                                    var name$12 = Fm$Name$from_bits($1756);
                                    var comp$13 = Fm$Comp$compile($1759)(Maybe$some($1760))(defs$1)(List$nil);
                                    return String$flatten(List$cons(code$5)(List$cons("var ")(List$cons(Fm$Name$show(name$12))(List$cons(" = ")(List$cons((() => {
                                        var self = comp$13;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return "\'error\'";
                                            case 'Maybe.some':
                                                var $1762 = self.value;
                                                return Fm$Comp$js($1762);
                                        }
                                    })())(List$cons(";\u{a}")(List$nil)))))))
                                })();
                        }
                    })();
            }
        })()))));
        return code$4
    })());
    var main = (() => {
        var sstr$1 = Fm$Term$serialize$string;
        return Monad$bind(IO$monad)(IO$get_args)((name$2 => (() => {
            var name$3 = (() => {
                var self = name$2;
                switch (self.length === 0 ? 'nil' : 'cons') {
                    case 'nil':
                        return "main.fm";
                    case 'cons':
                        var $1763 = self.charCodeAt(0);
                        var $1764 = self.slice(1);
                        return name$2;
                }
            })();
            var name$4 = (() => {
                var self = (name$3 === "main");
                switch (self ? 'true' : 'false') {
                    case 'true':
                        return "main.fm";
                    case 'false':
                        return name$3;
                }
            })();
            return Monad$bind(IO$monad)(IO$get_file(name$4))((file$5 => (() => {
                var defs$6 = Maybe$default(Map$new)(Fm$Defs$read(file$5));
                var defs$7 = Fm$synth(defs$6);
                var report$8 = Fm$report(defs$7);
                return Monad$bind(IO$monad)(IO$print(report$8))(($9 => IO$print(Fm$Comp$js$defs(defs$7))))
            })()))
        })()))
    })();
    return {
        '$main$': () => run(main),
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.eql': Cmp$eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Nat.cmp': Nat$cmp,
        'Nat.gte': Nat$gte,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.succ': Nat$succ,
        'Nat.sub_rem': Nat$sub_rem,
        'Pair': Pair,
        'Pair.new': Pair$new,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.zero': Nat$zero,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'List.nil': List$nil,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Pair.snd': Pair$snd,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Nat.gtn': Nat$gtn,
        'Cmp.as_lte': Cmp$as_lte,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Nat.pred': Nat$pred,
        'Nat.sub': Nat$sub,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'Fm.Term.var': Fm$Term$var,
        'Fm.Term.serialize.string': Fm$Term$serialize$string,
        'Monad.bind': Monad$bind,
        'IO': IO,
        'Monad.new': Monad$new,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.get_args': IO$get_args,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.cmp.go': Word$cmp$go,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
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
        'Parser.maybe': Parser$maybe,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.first_of': Parser$first_of,
        'Unit.new': Unit$new,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.char_if': Parser$char_if,
        'Bool.not': Bool$not,
        'Fm.Parser.spaces': Fm$Parser$spaces,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.btw': U16$btw,
        'Fm.Name.is_letter': Fm$Name$is_letter,
        'Fm.Parser.letter': Fm$Parser$letter,
        'Monad.pure': Monad$pure,
        'Fm.Parser.name': Fm$Parser$name,
        'Parser.many1': Parser$many1,
        'Fm.Parser.spaces_text': Fm$Parser$spaces_text,
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
        'List.at_last': List$at_last,
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
        'Fm.Error.show_goal': Fm$Error$show_goal,
        'Fm.Term.desugar_app': Fm$Term$desugar_app,
        'Fm.Error.patch': Fm$Error$patch,
        'Fm.MPath.to_bits': Fm$MPath$to_bits,
        'Fm.Term.desugar_cse.motive': Fm$Term$desugar_cse$motive,
        'Fm.Term.desugar_cse.argument': Fm$Term$desugar_cse$argument,
        'Maybe.or': Maybe$or,
        'Fm.Term.desugar_cse.cases': Fm$Term$desugar_cse$cases,
        'Fm.Term.desugar_cse': Fm$Term$desugar_cse,
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
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Fm.Comp.var': Fm$Comp$var,
        'Fm.Comp.ref': Fm$Comp$ref,
        'Fm.Comp.nil': Fm$Comp$nil,
        'Fm.Comp.lam': Fm$Comp$lam,
        'Fm.Prim.chr': Fm$Prim$chr,
        'Fm.Prim.str': Fm$Prim$str,
        'Fm.Prim.nat': Fm$Prim$nat,
        'Fm.Comp.prims': Fm$Comp$prims,
        'Fm.Check.value': Fm$Check$value,
        'Fm.Comp.prim_of': Fm$Comp$prim_of,
        'Fm.Comp.ins': Fm$Comp$ins,
        'Fm.Comp.eli': Fm$Comp$eli,
        'Fm.Comp.app': Fm$Comp$app,
        'Fm.Comp.let': Fm$Comp$let,
        'Fm.Comp.compile': Fm$Comp$compile,
        'Fm.Comp.js': Fm$Comp$js,
        'Fm.Comp.js.defs': Fm$Comp$js$defs,
        'main': main,
    };
})();
module.exports['$main$']().then(() => process.exit());
