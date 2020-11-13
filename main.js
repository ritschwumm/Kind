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
    var inst_mutset = x => x({});
    var elim_mutset = (x => (() => c0 => {
        var self = x;
        switch ((() => {
            throw 'TODO'
        })()) {
            case 'new':
                var $6 = null;
                return c0($6);
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
                                    var $7 = (self - 1n);
                                    return Cmp$ltn;
                            }
                        })();
                    case 'succ':
                        var $8 = (self - 1n);
                        return (() => {
                            var self = b$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Cmp$gtn;
                                case 'succ':
                                    var $9 = (self - 1n);
                                    return Nat$cmp($8)($9);
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
                var $10 = self.head;
                var $11 = self.tail;
                return cons$5($10)(List$fold($11)(nil$4)(cons$5));
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
                        var $12 = (self - 1n);
                        return (() => {
                            var self = n$1;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Either$right(Nat$succ($12));
                                case 'succ':
                                    var $13 = (self - 1n);
                                    return Nat$sub_rem($13)($12);
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
                        var $14 = self.value;
                        return Nat$div_mod$go($14)(m$2)(Nat$succ(d$3));
                    case 'Either.right':
                        var $15 = self.value;
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
                        var $16 = self.fst;
                        var $17 = self.snd;
                        return (() => {
                            var self = $16;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return List$cons($17)(res$3);
                                case 'succ':
                                    var $18 = (self - 1n);
                                    return Nat$to_base$go(base$1)($16)(List$cons($17)(res$3));
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
                var $19 = self.fst;
                var $20 = self.snd;
                return $20;
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
                        var $21 = self.head;
                        var $22 = self.tail;
                        return (() => {
                            var self = index$2;
                            switch (self === 0n ? 'zero' : 'succ') {
                                case 'zero':
                                    return Maybe$some($21);
                                case 'succ':
                                    var $23 = (self - 1n);
                                    return List$at($23)($22);
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
                                var $24 = self.value;
                                return $24;
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
                var $25 = (self - 1n);
                return $25;
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
                        var $26 = self.head;
                        var $27 = self.tail;
                        return String$flatten$go($27)((res$2 + $26));
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
                var $28 = self.name;
                var $29 = self.indx;
                return (() => {
                    var self = ($29 >= init$3);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return ("#" + Nat$show(Nat$pred((depth$2 - $29 <= 0n ? 0n : depth$2 - $29))));
                        case 'false':
                            return ("^" + Nat$show($29));
                    }
                })();
            case 'Fm.Term.ref':
                var $30 = self.name;
                return $30;
            case 'Fm.Term.typ':
                return "*";
            case 'Fm.Term.all':
                var $31 = self.eras;
                var $32 = self.self;
                var $33 = self.name;
                var $34 = self.xtyp;
                var $35 = self.body;
                return String$flatten(List$cons("\u{2200}")(List$cons($32)(List$cons(Fm$Term$serialize$string($34)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($35(Fm$Term$var($32)(depth$2))(Fm$Term$var($33)(Nat$succ(depth$2))))(Nat$succ(Nat$succ(depth$2)))(init$3))(List$nil)))));
            case 'Fm.Term.lam':
                var $36 = self.name;
                var $37 = self.body;
                return String$flatten(List$cons("\u{3bb}")(List$cons(Fm$Term$serialize$string($37(Fm$Term$var($36)(depth$2)))(Nat$succ(depth$2))(init$3))(List$nil)));
            case 'Fm.Term.app':
                var $38 = self.func;
                var $39 = self.argm;
                return String$flatten(List$cons("@")(List$cons(Fm$Term$serialize$string($38)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($39)(depth$2)(init$3))(List$nil))));
            case 'Fm.Term.let':
                var $40 = self.name;
                var $41 = self.expr;
                var $42 = self.body;
                return String$flatten(List$cons("$")(List$cons(Fm$Term$serialize$string($41)(depth$2)(init$3))(List$cons(Fm$Term$serialize$string($42(Fm$Term$var($40)(depth$2)))(Nat$succ(depth$2))(init$3))(List$nil))));
            case 'Fm.Term.def':
                var $43 = self.name;
                var $44 = self.expr;
                var $45 = self.body;
                return Fm$Term$serialize$string($45($44))(depth$2)(init$3);
            case 'Fm.Term.ann':
                var $46 = self.done;
                var $47 = self.term;
                var $48 = self.type;
                return Fm$Term$serialize$string($47)(depth$2)(init$3);
            case 'Fm.Term.gol':
                var $49 = self.name;
                var $50 = self.dref;
                var $51 = self.verb;
                return String$flatten(List$cons("?")(List$cons($49)(List$nil)));
            case 'Fm.Term.hol':
                var $52 = self.path;
                return "_";
            case 'Fm.Term.nat':
                var $53 = self.natx;
                return "_";
            case 'Fm.Term.chr':
                var $54 = self.chrx;
                return "_";
            case 'Fm.Term.str':
                var $55 = self.strx;
                return "_";
            case 'Fm.Term.cse':
                var $56 = self.path;
                var $57 = self.expr;
                var $58 = self.name;
                var $59 = self.with;
                var $60 = self.cses;
                var $61 = self.moti;
                return "_";
        }
    })())));
    var Monad$bind = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Monad.new':
                var $62 = self.bind;
                var $63 = self.pure;
                return $62;
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
                var $64 = self.value;
                return f$4($64);
            case 'IO.ask':
                var $65 = self.query;
                var $66 = self.param;
                var $67 = self.then;
                return IO$ask($65)($66)((x$8 => IO$bind($67(x$8))(f$4)));
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
                var $87 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $88 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($88)(c$4));
                        case 'Word.1':
                            var $89 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($89)(Cmp$ltn));
                    }
                })()($87));
            case 'Word.1':
                var $90 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => c$4);
                        case 'Word.0':
                            var $91 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($91)(Cmp$gtn));
                        case 'Word.1':
                            var $92 = self.pred;
                            return (a$pred$10 => Word$cmp$go(a$pred$10)($92)(c$4));
                    }
                })()($90));
        }
    })()(b$3))));
    var Word$cmp = (a$2 => (b$3 => Word$cmp$go(a$2)(b$3)(Cmp$eql)));
    var Word$eql = (a$2 => (b$3 => Cmp$as_eql(Word$cmp(a$2)(b$3))));
    var U16$eql = a0 => a1 => (a0 === a1);
    var Parser$text$go = (text$1 => (code$2 => (() => {
        var self = text$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$value(code$2)(Unit$new);
            case 'cons':
                var $93 = self.charCodeAt(0);
                var $94 = self.slice(1);
                return (() => {
                    var self = code$2;
                    switch (self.length === 0 ? 'nil' : 'cons') {
                        case 'nil':
                            return (() => {
                                var error$5 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found end of file.")(List$nil))));
                                return Parser$Reply$error(code$2)(error$5)
                            })();
                        case 'cons':
                            var $95 = self.charCodeAt(0);
                            var $96 = self.slice(1);
                            return (() => {
                                var self = ($93 === $95);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$text($94)($96);
                                    case 'false':
                                        return (() => {
                                            var error$7 = String$flatten(List$cons("Expected \'")(List$cons(text$1)(List$cons("\', found \'")(List$cons(String$cons($95)(String$nil))(List$cons("\'.")(List$nil))))));
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
                var $97 = self.code;
                var $98 = self.err;
                return Parser$Reply$error(code$2)($98);
            case 'Parser.Reply.value':
                var $99 = self.code;
                var $100 = self.val;
                return Parser$Reply$value($99)($100);
        }
    })()));
    var Parser$char_if = (fun$1 => (code$2 => (() => {
        var self = code$2;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$2)("No parse.");
            case 'cons':
                var $101 = self.charCodeAt(0);
                var $102 = self.slice(1);
                return (() => {
                    var self = fun$1($101);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($102)($101);
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
                var $103 = self.charCodeAt(0);
                var $104 = self.slice(1);
                return (() => {
                    var self = Fm$Name$is_letter($103);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($104)($103);
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
                var $105 = self.bind;
                var $106 = self.pure;
                return $106;
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
                    var $107 = self.eras;
                    var $108 = self.name;
                    var $109 = self.term;
                    return Fm$Term$all($107)("")($108)($109)((s$11 => (x$12 => t$7)));
            }
        })())));
        return Monad$pure(Parser$monad)((() => {
            var self = term$6;
            switch (self._) {
                case 'Fm.Term.var':
                    var $110 = self.name;
                    var $111 = self.indx;
                    return term$6;
                case 'Fm.Term.ref':
                    var $112 = self.name;
                    return term$6;
                case 'Fm.Term.typ':
                    return term$6;
                case 'Fm.Term.all':
                    var $113 = self.eras;
                    var $114 = self.self;
                    var $115 = self.name;
                    var $116 = self.xtyp;
                    var $117 = self.body;
                    return Fm$Term$all($113)(self$2)($115)($116)($117);
                case 'Fm.Term.lam':
                    var $118 = self.name;
                    var $119 = self.body;
                    return term$6;
                case 'Fm.Term.app':
                    var $120 = self.func;
                    var $121 = self.argm;
                    return term$6;
                case 'Fm.Term.let':
                    var $122 = self.name;
                    var $123 = self.expr;
                    var $124 = self.body;
                    return term$6;
                case 'Fm.Term.def':
                    var $125 = self.name;
                    var $126 = self.expr;
                    var $127 = self.body;
                    return term$6;
                case 'Fm.Term.ann':
                    var $128 = self.done;
                    var $129 = self.term;
                    var $130 = self.type;
                    return term$6;
                case 'Fm.Term.gol':
                    var $131 = self.name;
                    var $132 = self.dref;
                    var $133 = self.verb;
                    return term$6;
                case 'Fm.Term.hol':
                    var $134 = self.path;
                    return term$6;
                case 'Fm.Term.nat':
                    var $135 = self.natx;
                    return term$6;
                case 'Fm.Term.chr':
                    var $136 = self.chrx;
                    return term$6;
                case 'Fm.Term.str':
                    var $137 = self.strx;
                    return term$6;
                case 'Fm.Term.cse':
                    var $138 = self.path;
                    var $139 = self.expr;
                    var $140 = self.name;
                    var $141 = self.with;
                    var $142 = self.cses;
                    var $143 = self.moti;
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
                var $144 = self.head;
                var $145 = self.tail;
                return Fm$Term$lam($144)((x$5 => Fm$Parser$make_lambda($145)(body$2)));
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
    var Fm$Parser$let = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("let "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("="))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$5 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$spaces_text(";")))(($6 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$7 => Monad$pure(Parser$monad)(Fm$Term$let(name$3)(expr$5)((x$8 => body$7)))))))))))))))));
    var Fm$Term$def = (name$1 => (expr$2 => (body$3 => ({
        _: 'Fm.Term.def',
        'name': name$1,
        'expr': expr$2,
        'body': body$3
    }))));
    var Fm$Parser$def = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("def "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$name)((name$3 => Monad$bind(Parser$monad)(Fm$Parser$spaces_text("="))(($4 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$5 => Monad$bind(Parser$monad)(Parser$maybe(Fm$Parser$spaces_text(";")))(($6 => Monad$bind(Parser$monad)(Fm$Parser$term)((body$7 => Monad$pure(Parser$monad)(Fm$Term$def(name$3)(expr$5)((x$8 => body$7)))))))))))))))));
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
                var $146 = self.head;
                var $147 = self.tail;
                return List$cons(f$4($146))(List$mapped($147)(f$4));
        }
    })()));
    var Fm$escapes = List$cons(Pair$new("\\b")(8))(List$cons(Pair$new("\\f")(12))(List$cons(Pair$new("\\n")(10))(List$cons(Pair$new("\\r")(13))(List$cons(Pair$new("\\t")(9))(List$cons(Pair$new("\\v")(11))(List$cons(Pair$new("\\\"")(34))(List$cons(Pair$new("\\0")(0))(List$cons(Pair$new("\\\'")(39))(List$nil)))))))));
    var Parser$one = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("Unexpected end of file.");
            case 'cons':
                var $148 = self.charCodeAt(0);
                var $149 = self.slice(1);
                return Parser$Reply$value($149)($148);
        }
    })());
    var Fm$Parser$char$single = Parser$first_of(List$cons(Parser$first_of(List$mapped(Fm$escapes)((esc$1 => (() => {
        var self = esc$1;
        switch (self._) {
            case 'Pair.new':
                var $150 = self.fst;
                var $151 = self.snd;
                return Monad$bind(Parser$monad)(Parser$text($150))(($4 => Monad$pure(Parser$monad)($151)));
        }
    })()))))(List$cons(Parser$one)(List$nil)));
    var Fm$Term$chr = (chrx$1 => ({
        _: 'Fm.Term.chr',
        'chrx': chrx$1
    }));
    var Fm$Parser$char = Monad$bind(Parser$monad)(Parser$spaces_text("\'"))(($1 => Monad$bind(Parser$monad)(Fm$Parser$char$single)((chrx$2 => Monad$bind(Parser$monad)(Parser$text("\'"))(($3 => Monad$pure(Parser$monad)(Fm$Term$chr(chrx$2))))))));
    var Parser$if_not = (a$2 => (b$3 => (code$4 => (() => {
        var self = a$2(code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $152 = self.code;
                var $153 = self.err;
                return b$3(code$4);
            case 'Parser.Reply.value':
                var $154 = self.code;
                var $155 = self.val;
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
                            var $156 = self.val;
                            var $157 = self.lft;
                            var $158 = self.rgt;
                            return Map$tie(Maybe$some(val$3))($157)($158);
                    }
                })();
            case '0':
                var $159 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$set($159)(val$3)(Map$new))(Map$new);
                        case 'Map.tie':
                            var $160 = self.val;
                            var $161 = self.lft;
                            var $162 = self.rgt;
                            return Map$tie($160)(Map$set($159)(val$3)($161))($162);
                    }
                })();
            case '1':
                var $163 = self.slice(0, -1);
                return (() => {
                    var self = map$4;
                    switch (self._) {
                        case 'Map.new':
                            return Map$tie(Maybe$none)(Map$new)(Map$set($163)(val$3)(Map$new));
                        case 'Map.tie':
                            var $164 = self.val;
                            var $165 = self.lft;
                            var $166 = self.rgt;
                            return Map$tie($164)($165)(Map$set($163)(val$3)($166));
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
                var $167 = self.head;
                var $168 = self.tail;
                return (() => {
                    var self = $167;
                    switch (self._) {
                        case 'Pair.new':
                            var $169 = self.fst;
                            var $170 = self.snd;
                            return Map$set(f$3($169))($170)(Map$from_list(f$3)($168));
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
                                        return Word$1(Word$subber(a$pred$10)($172)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($172)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $173 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$subber(a$pred$10)($173)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($173)(Bool$true));
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
                                        return Word$0(Word$subber(a$pred$10)($175)(Bool$false));
                                    case 'false':
                                        return Word$1(Word$subber(a$pred$10)($175)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $176 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$subber(a$pred$10)($176)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$subber(a$pred$10)($176)(Bool$false));
                                }
                            })());
                    }
                })()($174));
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
                        var $177 = (self - 1n);
                        return Nat$apply($177)(f$3)(f$3(x$4));
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
                var $178 = self.pred;
                return Word$1($178);
            case 'Word.1':
                var $179 = self.pred;
                return Word$0(Word$inc($179));
        }
    })());
    var U16$inc = (a$1 => (() => {
        var self = a$1;
        switch ('u16') {
            case 'u16':
                var $180 = u16_to_word(self);
                return U16$new(Word$inc($180));
        }
    })());
    var Word$zero = (size$1 => (() => {
        var self = size$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $181 = (self - 1n);
                return Word$0(Word$zero($181));
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
                var $182 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $183 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($183)(Bool$false));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($183)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $184 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($184)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($184)(Bool$false));
                                }
                            })());
                    }
                })()($182));
            case 'Word.1':
                var $185 = self.pred;
                return (b$7 => (() => {
                    var self = b$7;
                    switch (self._) {
                        case 'Word.nil':
                            return (a$pred$8 => Word$nil);
                        case 'Word.0':
                            var $186 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$0(Word$adder(a$pred$10)($186)(Bool$true));
                                    case 'false':
                                        return Word$1(Word$adder(a$pred$10)($186)(Bool$false));
                                }
                            })());
                        case 'Word.1':
                            var $187 = self.pred;
                            return (a$pred$10 => (() => {
                                var self = c$4;
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Word$1(Word$adder(a$pred$10)($187)(Bool$true));
                                    case 'false':
                                        return Word$0(Word$adder(a$pred$10)($187)(Bool$true));
                                }
                            })());
                    }
                })()($185));
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
                var $188 = self.pred;
                return Bits$0(Word$to_bits($188));
            case 'Word.1':
                var $189 = self.pred;
                return Bits$1(Word$to_bits($189));
        }
    })());
    var Word$trim = (new_size$2 => (word$3 => (() => {
        var self = new_size$2;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return Word$nil;
            case 'succ':
                var $190 = (self - 1n);
                return (() => {
                    var self = word$3;
                    switch (self._) {
                        case 'Word.nil':
                            return Word$0(Word$trim($190)(Word$nil));
                        case 'Word.0':
                            var $191 = self.pred;
                            return Word$0(Word$trim($190)($191));
                        case 'Word.1':
                            var $192 = self.pred;
                            return Word$1(Word$trim($190)($192));
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
                        var $193 = self.slice(0, -1);
                        return Bits$reverse$tco($193)(Bits$0(r$2));
                    case '1':
                        var $194 = self.slice(0, -1);
                        return Bits$reverse$tco($194)(Bits$1(r$2));
                }
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    var Bits$reverse = (a$1 => Bits$reverse$tco(a$1)(Bits$nil));
    var Fm$Name$to_bits = a0 => (fm_name_to_bits(a0));
    var Fm$Term$cse = (path$1 => (expr$2 => (name$3 => (with$4 => (cses$5 => (moti$6 => ({
        _: 'Fm.Term.cse',
        'path': path$1,
        'expr': expr$2,
        'name': name$3,
        'with': with$4,
        'cses': cses$5,
        'moti': moti$6
    })))))));
    var Fm$Parser$case = Monad$bind(Parser$monad)(Fm$Parser$spaces_text("case "))(($1 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($2 => Monad$bind(Parser$monad)(Fm$Parser$term)((expr$3 => Monad$bind(Parser$monad)(Parser$maybe(Monad$bind(Parser$monad)(Fm$Parser$spaces_text("as"))(($4 => Monad$bind(Parser$monad)(Fm$Parser$spaces)(($5 => Fm$Parser$name1))))))((name$4 => (() => {
        var name$5 = (() => {
            var self = name$4;
            switch (self._) {
                case 'Maybe.none':
                    return (() => {
                        var self = expr$3;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $195 = self.name;
                                var $196 = self.indx;
                                return $195;
                            case 'Fm.Term.ref':
                                var $197 = self.name;
                                return $197;
                            case 'Fm.Term.typ':
                                return Fm$Name$read("self");
                            case 'Fm.Term.all':
                                var $198 = self.eras;
                                var $199 = self.self;
                                var $200 = self.name;
                                var $201 = self.xtyp;
                                var $202 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.lam':
                                var $203 = self.name;
                                var $204 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.app':
                                var $205 = self.func;
                                var $206 = self.argm;
                                return Fm$Name$read("self");
                            case 'Fm.Term.let':
                                var $207 = self.name;
                                var $208 = self.expr;
                                var $209 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.def':
                                var $210 = self.name;
                                var $211 = self.expr;
                                var $212 = self.body;
                                return Fm$Name$read("self");
                            case 'Fm.Term.ann':
                                var $213 = self.done;
                                var $214 = self.term;
                                var $215 = self.type;
                                return Fm$Name$read("self");
                            case 'Fm.Term.gol':
                                var $216 = self.name;
                                var $217 = self.dref;
                                var $218 = self.verb;
                                return Fm$Name$read("self");
                            case 'Fm.Term.hol':
                                var $219 = self.path;
                                return Fm$Name$read("self");
                            case 'Fm.Term.nat':
                                var $220 = self.natx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.chr':
                                var $221 = self.chrx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.str':
                                var $222 = self.strx;
                                return Fm$Name$read("self");
                            case 'Fm.Term.cse':
                                var $223 = self.path;
                                var $224 = self.expr;
                                var $225 = self.name;
                                var $226 = self.with;
                                var $227 = self.cses;
                                var $228 = self.moti;
                                return Fm$Name$read("self");
                        }
                    })();
                case 'Maybe.some':
                    var $229 = self.value;
                    return $229;
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
                            var $230 = self.value;
                            return $230;
                    }
                })();
                return Monad$pure(Parser$monad)(Fm$Term$cse(Bits$nil)(expr$3)(name$5)(with$6)(cses$9)(moti$12))
            })()))))
        })()))))))
    })()))))))));
    var Parser$digit = (code$1 => (() => {
        var self = code$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Parser$Reply$error(code$1)("No parse.");
            case 'cons':
                var $231 = self.charCodeAt(0);
                var $232 = self.slice(1);
                return (() => {
                    var self = ($231 === 48);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Parser$Reply$value($232)(0n);
                        case 'false':
                            return (() => {
                                var self = ($231 === 49);
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Parser$Reply$value($232)(1n);
                                    case 'false':
                                        return (() => {
                                            var self = ($231 === 50);
                                            switch (self ? 'true' : 'false') {
                                                case 'true':
                                                    return Parser$Reply$value($232)(2n);
                                                case 'false':
                                                    return (() => {
                                                        var self = ($231 === 51);
                                                        switch (self ? 'true' : 'false') {
                                                            case 'true':
                                                                return Parser$Reply$value($232)(3n);
                                                            case 'false':
                                                                return (() => {
                                                                    var self = ($231 === 52);
                                                                    switch (self ? 'true' : 'false') {
                                                                        case 'true':
                                                                            return Parser$Reply$value($232)(4n);
                                                                        case 'false':
                                                                            return (() => {
                                                                                var self = ($231 === 53);
                                                                                switch (self ? 'true' : 'false') {
                                                                                    case 'true':
                                                                                        return Parser$Reply$value($232)(5n);
                                                                                    case 'false':
                                                                                        return (() => {
                                                                                            var self = ($231 === 54);
                                                                                            switch (self ? 'true' : 'false') {
                                                                                                case 'true':
                                                                                                    return Parser$Reply$value($232)(6n);
                                                                                                case 'false':
                                                                                                    return (() => {
                                                                                                        var self = ($231 === 55);
                                                                                                        switch (self ? 'true' : 'false') {
                                                                                                            case 'true':
                                                                                                                return Parser$Reply$value($232)(7n);
                                                                                                            case 'false':
                                                                                                                return (() => {
                                                                                                                    var self = ($231 === 56);
                                                                                                                    switch (self ? 'true' : 'false') {
                                                                                                                        case 'true':
                                                                                                                            return Parser$Reply$value($232)(8n);
                                                                                                                        case 'false':
                                                                                                                            return (() => {
                                                                                                                                var self = ($231 === 57);
                                                                                                                                switch (self ? 'true' : 'false') {
                                                                                                                                    case 'true':
                                                                                                                                        return Parser$Reply$value($232)(9n);
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
                        var $233 = self.head;
                        var $234 = self.tail;
                        return Nat$from_base$go(b$1)($234)((b$1 * p$3))((($233 * p$3) + res$4));
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
                        var $235 = self.head;
                        var $236 = self.tail;
                        return List$reverse$go($236)(List$cons($235)(res$3));
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
                var $237 = self.slice(0, -1);
                return $237;
            case '1':
                var $238 = self.slice(0, -1);
                return $238;
        }
    })());
    var Bits$inc = (a$1 => (() => {
        var self = a$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return Bits$1(Bits$nil);
            case '0':
                var $239 = self.slice(0, -1);
                return Bits$1($239);
            case '1':
                var $240 = self.slice(0, -1);
                return Bits$0(Bits$inc($240));
        }
    })());
    var Nat$to_bits = a0 => (nat_to_bits(a0));
    var Maybe$to_bool = (m$2 => (() => {
        var self = m$2;
        switch (self._) {
            case 'Maybe.none':
                return Bool$false;
            case 'Maybe.some':
                var $241 = self.value;
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
                var suffix_parser$3 = Parser$first_of(List$cons(Fm$Parser$application(term$1))(List$cons(Fm$Parser$arrow(term$1))(List$cons(Fm$Parser$annotation(term$1))(List$nil))));
                return (() => {
                    var self = suffix_parser$3(code$2);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $242 = self.code;
                            var $243 = self.err;
                            return Parser$Reply$value(code$2)(term$1);
                        case 'Parser.Reply.value':
                            var $244 = self.code;
                            var $245 = self.val;
                            return Fm$Parser$suffix($245)($244);
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
                var $246 = self.fst;
                var $247 = self.snd;
                return Fm$Binder$new(eras$1)($246)($247);
        }
    })()))))))))));
    var List$concat = (as$2 => (bs$3 => (() => {
        var self = as$2;
        switch (self._) {
            case 'List.nil':
                return bs$3;
            case 'List.cons':
                var $248 = self.head;
                var $249 = self.tail;
                return List$cons($248)(List$concat($249)(bs$3));
        }
    })()));
    var List$flatten = (xs$2 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'List.nil':
                return List$nil;
            case 'List.cons':
                var $250 = self.head;
                var $251 = self.tail;
                return List$concat($250)(List$flatten($251));
        }
    })());
    var Fm$Parser$binder = Monad$bind(Parser$monad)(Parser$many1(Parser$first_of(List$cons(Fm$Parser$binder$homo(Bool$true))(List$cons(Fm$Parser$binder$homo(Bool$false))(List$nil)))))((lists$1 => Monad$pure(Parser$monad)(List$flatten(lists$1))));
    var Fm$Parser$make_forall = (binds$1 => (body$2 => (() => {
        var self = binds$1;
        switch (self._) {
            case 'List.nil':
                return body$2;
            case 'List.cons':
                var $252 = self.head;
                var $253 = self.tail;
                return (() => {
                    var self = $252;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $254 = self.eras;
                            var $255 = self.name;
                            var $256 = self.term;
                            return Fm$Term$all($254)("")($255)($256)((s$8 => (x$9 => Fm$Parser$make_forall($253)(body$2))));
                    }
                })();
        }
    })()));
    var List$at_last = (index$2 => (list$3 => List$at(index$2)(List$reverse(list$3))));
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
                        var $257 = self.head;
                        var $258 = self.tail;
                        return (() => {
                            var self = $257;
                            switch (self._) {
                                case 'Pair.new':
                                    var $259 = self.fst;
                                    var $260 = self.snd;
                                    return (() => {
                                        var self = Fm$Name$eql(name$1)($259);
                                        switch (self ? 'true' : 'false') {
                                            case 'true':
                                                return Maybe$some($260);
                                            case 'false':
                                                return Fm$Context$find(name$1)($258);
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
                        var $261 = self.head;
                        var $262 = self.tail;
                        return List$length$go($262)(Nat$succ(n$3));
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
                var $263 = self.name;
                var $264 = self.indx;
                return (() => {
                    var self = List$at_last($264)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$var($263)($264);
                        case 'Maybe.some':
                            var $265 = self.value;
                            return Pair$snd($265);
                    }
                })();
            case 'Fm.Term.ref':
                var $266 = self.name;
                return (() => {
                    var self = Fm$Context$find($266)(vars$1);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($266);
                        case 'Maybe.some':
                            var $267 = self.value;
                            return $267;
                    }
                })();
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $268 = self.eras;
                var $269 = self.self;
                var $270 = self.name;
                var $271 = self.xtyp;
                var $272 = self.body;
                return (() => {
                    var vlen$9 = List$length(vars$1);
                    return Fm$Term$all($268)($269)($270)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($271))((s$10 => (x$11 => Fm$Term$bind(List$cons(Pair$new($270)(x$11))(List$cons(Pair$new($269)(s$10))(vars$1)))(Fm$Path$1(path$2))($272(Fm$Term$var($269)(vlen$9))(Fm$Term$var($270)(Nat$succ(vlen$9)))))))
                })();
            case 'Fm.Term.lam':
                var $273 = self.name;
                var $274 = self.body;
                return (() => {
                    var vlen$6 = List$length(vars$1);
                    return Fm$Term$lam($273)((x$7 => Fm$Term$bind(List$cons(Pair$new($273)(x$7))(vars$1))(Fm$Path$0(path$2))($274(Fm$Term$var($273)(vlen$6)))))
                })();
            case 'Fm.Term.app':
                var $275 = self.func;
                var $276 = self.argm;
                return Fm$Term$app(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($275))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($276));
            case 'Fm.Term.let':
                var $277 = self.name;
                var $278 = self.expr;
                var $279 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$let($277)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($278))((x$8 => Fm$Term$bind(List$cons(Pair$new($277)(x$8))(vars$1))(Fm$Path$1(path$2))($279(Fm$Term$var($277)(vlen$7)))))
                })();
            case 'Fm.Term.def':
                var $280 = self.name;
                var $281 = self.expr;
                var $282 = self.body;
                return (() => {
                    var vlen$7 = List$length(vars$1);
                    return Fm$Term$def($280)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($281))((x$8 => Fm$Term$bind(List$cons(Pair$new($280)(x$8))(vars$1))(Fm$Path$1(path$2))($282(Fm$Term$var($280)(vlen$7)))))
                })();
            case 'Fm.Term.ann':
                var $283 = self.done;
                var $284 = self.term;
                var $285 = self.type;
                return Fm$Term$ann($283)(Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($284))(Fm$Term$bind(vars$1)(Fm$Path$1(path$2))($285));
            case 'Fm.Term.gol':
                var $286 = self.name;
                var $287 = self.dref;
                var $288 = self.verb;
                return Fm$Term$gol($286)($287)($288);
            case 'Fm.Term.hol':
                var $289 = self.path;
                return Fm$Term$hol(Fm$Path$to_bits(path$2));
            case 'Fm.Term.nat':
                var $290 = self.natx;
                return Fm$Term$nat($290);
            case 'Fm.Term.chr':
                var $291 = self.chrx;
                return Fm$Term$chr($291);
            case 'Fm.Term.str':
                var $292 = self.strx;
                return Fm$Term$str($292);
            case 'Fm.Term.cse':
                var $293 = self.path;
                var $294 = self.expr;
                var $295 = self.name;
                var $296 = self.with;
                var $297 = self.cses;
                var $298 = self.moti;
                return (() => {
                    var expr$10 = Fm$Term$bind(vars$1)(Fm$Path$0(path$2))($294);
                    var name$11 = $295;
                    var with$12 = $296;
                    var cses$13 = $297;
                    var moti$14 = $298;
                    return Fm$Term$cse(Fm$Path$to_bits(path$2))(expr$10)(name$11)(with$12)(cses$13)(moti$14)
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
                        var $299 = self.eras;
                        var $300 = self.name;
                        var $301 = self.term;
                        return $300;
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
                            var $302 = self.name;
                            var $303 = self.pars;
                            var $304 = self.inds;
                            var $305 = self.ctrs;
                            return (() => {
                                var slf$8 = Fm$Term$ref(name$2);
                                var slf$9 = (list_for($303)(slf$8)((var$9 => (slf$10 => Fm$Term$app(slf$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $306 = self.eras;
                                            var $307 = self.name;
                                            var $308 = self.term;
                                            return $307;
                                    }
                                })()))))));
                                var slf$10 = (list_for($304)(slf$9)((var$10 => (slf$11 => Fm$Term$app(slf$11)(Fm$Term$ref((() => {
                                    var self = var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $309 = self.eras;
                                            var $310 = self.name;
                                            var $311 = self.term;
                                            return $310;
                                    }
                                })()))))));
                                return Fm$Term$all(Bool$false)("")(Fm$Name$read("self"))(slf$10)((s$11 => (x$12 => Fm$Term$typ)))
                            })();
                    }
                })();
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
                            return Fm$Term$all($314)("")($315)($316)((s$9 => (x$10 => Fm$Datatype$build_term$motive$go(type$1)(name$2)($313))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$motive = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $317 = self.name;
                var $318 = self.pars;
                var $319 = self.inds;
                var $320 = self.ctrs;
                return Fm$Datatype$build_term$motive$go(type$1)($317)($319);
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
                            var $321 = self.name;
                            var $322 = self.pars;
                            var $323 = self.inds;
                            var $324 = self.ctrs;
                            return (() => {
                                var self = ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $325 = self.name;
                                        var $326 = self.args;
                                        var $327 = self.inds;
                                        return (() => {
                                            var ret$11 = Fm$Term$ref(Fm$Name$read("P"));
                                            var ret$12 = (list_for($327)(ret$11)((var$12 => (ret$13 => Fm$Term$app(ret$13)((() => {
                                                var self = var$12;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $328 = self.eras;
                                                        var $329 = self.name;
                                                        var $330 = self.term;
                                                        return $330;
                                                }
                                            })())))));
                                            var ctr$13 = String$flatten(List$cons($321)(List$cons(Fm$Name$read("."))(List$cons($325)(List$nil))));
                                            var slf$14 = Fm$Term$ref(ctr$13);
                                            var slf$15 = (list_for($322)(slf$14)((var$15 => (slf$16 => Fm$Term$app(slf$16)(Fm$Term$ref((() => {
                                                var self = var$15;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $331 = self.eras;
                                                        var $332 = self.name;
                                                        var $333 = self.term;
                                                        return $332;
                                                }
                                            })()))))));
                                            var slf$16 = (list_for($326)(slf$15)((var$16 => (slf$17 => Fm$Term$app(slf$17)(Fm$Term$ref((() => {
                                                var self = var$16;
                                                switch (self._) {
                                                    case 'Fm.Binder.new':
                                                        var $334 = self.eras;
                                                        var $335 = self.name;
                                                        var $336 = self.term;
                                                        return $335;
                                                }
                                            })()))))));
                                            return Fm$Term$app(ret$12)(slf$16)
                                        })();
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $337 = self.head;
                var $338 = self.tail;
                return (() => {
                    var self = $337;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $339 = self.eras;
                            var $340 = self.name;
                            var $341 = self.term;
                            return (() => {
                                var eras$9 = $339;
                                var name$10 = $340;
                                var xtyp$11 = $341;
                                var body$12 = Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($338);
                                return Fm$Term$all(eras$9)("")(name$10)(xtyp$11)((s$13 => (x$14 => body$12)))
                            })();
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructor = (type$1 => (ctor$2 => (() => {
        var self = ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $342 = self.name;
                var $343 = self.args;
                var $344 = self.inds;
                return Fm$Datatype$build_term$constructor$go(type$1)(ctor$2)($343);
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
                            var $345 = self.name;
                            var $346 = self.pars;
                            var $347 = self.inds;
                            var $348 = self.ctrs;
                            return (() => {
                                var ret$8 = Fm$Term$ref(Fm$Name$read("P"));
                                var ret$9 = (list_for($347)(ret$8)((var$9 => (ret$10 => Fm$Term$app(ret$10)(Fm$Term$ref((() => {
                                    var self = var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $349 = self.eras;
                                            var $350 = self.name;
                                            var $351 = self.term;
                                            return $350;
                                    }
                                })()))))));
                                return Fm$Term$app(ret$9)(Fm$Term$ref((name$2 + ".Self")))
                            })();
                    }
                })();
            case 'List.cons':
                var $352 = self.head;
                var $353 = self.tail;
                return (() => {
                    var self = $352;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $354 = self.name;
                            var $355 = self.args;
                            var $356 = self.inds;
                            return Fm$Term$all(Bool$false)("")($354)(Fm$Datatype$build_term$constructor(type$1)($352))((s$9 => (x$10 => Fm$Datatype$build_term$constructors$go(type$1)(name$2)($353))));
                    }
                })();
        }
    })())));
    var Fm$Datatype$build_term$constructors = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $357 = self.name;
                var $358 = self.pars;
                var $359 = self.inds;
                var $360 = self.ctrs;
                return Fm$Datatype$build_term$constructors$go(type$1)($357)($360);
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
                            return Fm$Term$all(Bool$true)((name$2 + ".Self"))(Fm$Name$read("P"))(Fm$Datatype$build_term$motive(type$1))((s$5 => (x$6 => Fm$Datatype$build_term$constructors(type$1))));
                        case 'List.cons':
                            var $361 = self.head;
                            var $362 = self.tail;
                            return (() => {
                                var self = $361;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $363 = self.eras;
                                        var $364 = self.name;
                                        var $365 = self.term;
                                        return Fm$Term$lam($364)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)(pars$3)($362)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $366 = self.head;
                var $367 = self.tail;
                return (() => {
                    var self = $366;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $368 = self.eras;
                            var $369 = self.name;
                            var $370 = self.term;
                            return Fm$Term$lam($369)((x$10 => Fm$Datatype$build_term$go(type$1)(name$2)($367)(inds$4)));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_term = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $371 = self.name;
                var $372 = self.pars;
                var $373 = self.inds;
                var $374 = self.ctrs;
                return Fm$Datatype$build_term$go(type$1)($371)($372)($373);
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
                            var $375 = self.head;
                            var $376 = self.tail;
                            return (() => {
                                var self = $375;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $377 = self.eras;
                                        var $378 = self.name;
                                        var $379 = self.term;
                                        return Fm$Term$all(Bool$false)("")($378)($379)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)(pars$3)($376))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $380 = self.head;
                var $381 = self.tail;
                return (() => {
                    var self = $380;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $382 = self.eras;
                            var $383 = self.name;
                            var $384 = self.term;
                            return Fm$Term$all(Bool$false)("")($383)($384)((s$10 => (x$11 => Fm$Datatype$build_type$go(type$1)(name$2)($381)(inds$4))));
                    }
                })();
        }
    })()))));
    var Fm$Datatype$build_type = (type$1 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $385 = self.name;
                var $386 = self.pars;
                var $387 = self.inds;
                var $388 = self.ctrs;
                return Fm$Datatype$build_type$go(type$1)($385)($386)($387);
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
                            var $389 = self.name;
                            var $390 = self.args;
                            var $391 = self.inds;
                            return (() => {
                                var ret$7 = Fm$Term$ref($389);
                                var ret$8 = (list_for($390)(ret$7)((arg$8 => (ret$9 => Fm$Term$app(ret$9)(Fm$Term$ref((() => {
                                    var self = arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $392 = self.eras;
                                            var $393 = self.name;
                                            var $394 = self.term;
                                            return $393;
                                    }
                                })()))))));
                                return ret$8
                            })();
                    }
                })();
            case 'List.cons':
                var $395 = self.head;
                var $396 = self.tail;
                return (() => {
                    var self = $395;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $397 = self.name;
                            var $398 = self.args;
                            var $399 = self.inds;
                            return Fm$Term$lam($397)((x$9 => Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($396)));
                    }
                })();
        }
    })())));
    var Fm$Constructor$build_term$opt = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $400 = self.name;
                var $401 = self.pars;
                var $402 = self.inds;
                var $403 = self.ctrs;
                return Fm$Constructor$build_term$opt$go(type$1)(ctor$2)($403);
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
                            var $404 = self.head;
                            var $405 = self.tail;
                            return (() => {
                                var self = $404;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $406 = self.eras;
                                        var $407 = self.name;
                                        var $408 = self.term;
                                        return Fm$Term$lam($407)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)(pars$4)($405)));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $409 = self.head;
                var $410 = self.tail;
                return (() => {
                    var self = $409;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $411 = self.eras;
                            var $412 = self.name;
                            var $413 = self.term;
                            return Fm$Term$lam($412)((x$11 => Fm$Constructor$build_term$go(type$1)(ctor$2)(name$3)($410)(args$5)));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_term = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $414 = self.name;
                var $415 = self.pars;
                var $416 = self.inds;
                var $417 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $418 = self.name;
                            var $419 = self.args;
                            var $420 = self.inds;
                            return Fm$Constructor$build_term$go(type$1)(ctor$2)($414)($415)($419);
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
                                        var $421 = self.name;
                                        var $422 = self.pars;
                                        var $423 = self.inds;
                                        var $424 = self.ctrs;
                                        return (() => {
                                            var self = ctor$2;
                                            switch (self._) {
                                                case 'Fm.Constructor.new':
                                                    var $425 = self.name;
                                                    var $426 = self.args;
                                                    var $427 = self.inds;
                                                    return (() => {
                                                        var type$13 = Fm$Term$ref(name$3);
                                                        var type$14 = (list_for($422)(type$13)((var$14 => (type$15 => Fm$Term$app(type$15)(Fm$Term$ref((() => {
                                                            var self = var$14;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $428 = self.eras;
                                                                    var $429 = self.name;
                                                                    var $430 = self.term;
                                                                    return $429;
                                                            }
                                                        })()))))));
                                                        var type$15 = (list_for($427)(type$14)((var$15 => (type$16 => Fm$Term$app(type$16)((() => {
                                                            var self = var$15;
                                                            switch (self._) {
                                                                case 'Fm.Binder.new':
                                                                    var $431 = self.eras;
                                                                    var $432 = self.name;
                                                                    var $433 = self.term;
                                                                    return $433;
                                                            }
                                                        })())))));
                                                        return type$15
                                                    })();
                                            }
                                        })();
                                }
                            })();
                        case 'List.cons':
                            var $434 = self.head;
                            var $435 = self.tail;
                            return (() => {
                                var self = $434;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $436 = self.eras;
                                        var $437 = self.name;
                                        var $438 = self.term;
                                        return Fm$Term$all($436)("")($437)($438)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)(pars$4)($435))));
                                }
                            })();
                    }
                })();
            case 'List.cons':
                var $439 = self.head;
                var $440 = self.tail;
                return (() => {
                    var self = $439;
                    switch (self._) {
                        case 'Fm.Binder.new':
                            var $441 = self.eras;
                            var $442 = self.name;
                            var $443 = self.term;
                            return Fm$Term$all($441)("")($442)($443)((s$11 => (x$12 => Fm$Constructor$build_type$go(type$1)(ctor$2)(name$3)($440)(args$5))));
                    }
                })();
        }
    })())))));
    var Fm$Constructor$build_type = (type$1 => (ctor$2 => (() => {
        var self = type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $444 = self.name;
                var $445 = self.pars;
                var $446 = self.inds;
                var $447 = self.ctrs;
                return (() => {
                    var self = ctor$2;
                    switch (self._) {
                        case 'Fm.Constructor.new':
                            var $448 = self.name;
                            var $449 = self.args;
                            var $450 = self.inds;
                            return Fm$Constructor$build_type$go(type$1)(ctor$2)($444)($445)($449);
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
                            var $451 = self.value;
                            return (() => {
                                var self = $451;
                                switch (self._) {
                                    case 'Fm.Datatype.new':
                                        var $452 = self.name;
                                        var $453 = self.pars;
                                        var $454 = self.inds;
                                        var $455 = self.ctrs;
                                        return (() => {
                                            var term$9 = Fm$Datatype$build_term($451);
                                            var term$10 = Fm$Term$bind(List$nil)((x$10 => Bits$1(x$10)))(term$9);
                                            var type$11 = Fm$Datatype$build_type($451);
                                            var type$12 = Fm$Term$bind(List$nil)((x$12 => Bits$0(x$12)))(type$11);
                                            var defs$13 = Fm$set($452)(Fm$Def$new($452)(term$10)(type$12)(Bool$false))(defs$1);
                                            var defs$14 = List$fold($455)(defs$13)((ctr$14 => (defs$15 => (() => {
                                                var typ_name$16 = $452;
                                                var ctr_name$17 = String$flatten(List$cons(typ_name$16)(List$cons(Fm$Name$read("."))(List$cons((() => {
                                                    var self = ctr$14;
                                                    switch (self._) {
                                                        case 'Fm.Constructor.new':
                                                            var $456 = self.name;
                                                            var $457 = self.args;
                                                            var $458 = self.inds;
                                                            return $456;
                                                    }
                                                })())(List$nil))));
                                                var ctr_term$18 = Fm$Constructor$build_term($451)(ctr$14);
                                                var ctr_term$19 = Fm$Term$bind(List$nil)((x$19 => Bits$1(x$19)))(ctr_term$18);
                                                var ctr_type$20 = Fm$Constructor$build_type($451)(ctr$14);
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
                var $459 = self.value;
                return (() => {
                    var self = $459;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $460 = self.name;
                            var $461 = self.term;
                            var $462 = self.type;
                            var $463 = self.done;
                            return Fm$Parser$file$go(Fm$set($460)($459)(defs$1));
                    }
                })();
        }
    })())));
    var Fm$Parser$file = Fm$Parser$file$go(Map$new);
    var Fm$Defs$read = (code$1 => (() => {
        var self = Fm$Parser$file(code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $464 = self.code;
                var $465 = self.err;
                return Maybe$none;
            case 'Parser.Reply.value':
                var $466 = self.code;
                var $467 = self.val;
                return Maybe$some($467);
        }
    })());
    var Map$to_list$go = (xs$2 => (key$3 => (list$4 => (() => {
        var self = xs$2;
        switch (self._) {
            case 'Map.new':
                return list$4;
            case 'Map.tie':
                var $468 = self.val;
                var $469 = self.lft;
                var $470 = self.rgt;
                return (() => {
                    var list0$8 = (() => {
                        var self = $468;
                        switch (self._) {
                            case 'Maybe.none':
                                return list$4;
                            case 'Maybe.some':
                                var $471 = self.value;
                                return List$cons(Pair$new(Bits$reverse(key$3))($471))(list$4);
                        }
                    })();
                    var list1$9 = Map$to_list$go($469)(Bits$0(key$3))(list0$8);
                    var list2$10 = Map$to_list$go($470)(Bits$1(key$3))(list1$9);
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
                var $472 = self.slice(0, -1);
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
                            var $473 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$0(chunk$4);
                                return Bits$chunks_of$go(len$1)($472)($473)(chunk$7)
                            })();
                    }
                })();
            case '1':
                var $474 = self.slice(0, -1);
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
                            var $475 = (self - 1n);
                            return (() => {
                                var chunk$7 = Bits$1(chunk$4);
                                return Bits$chunks_of$go(len$1)($474)($475)(chunk$7)
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
                var $476 = (self - 1n);
                return (() => {
                    var self = bits$2;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return Word$0(Word$from_bits($476)(Bits$nil));
                        case '0':
                            var $477 = self.slice(0, -1);
                            return Word$0(Word$from_bits($476)($477));
                        case '1':
                            var $478 = self.slice(0, -1);
                            return Word$1(Word$from_bits($476)($478));
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
                var $479 = self.value;
                var $480 = self.errors;
                return (() => {
                    var self = $479;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(Maybe$none)($480);
                        case 'Maybe.some':
                            var $481 = self.value;
                            return (() => {
                                var self = f$4($481);
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $482 = self.value;
                                        var $483 = self.errors;
                                        return Fm$Check$result($482)(List$concat($480)($483));
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
                                    var $484 = self.val;
                                    var $485 = self.lft;
                                    var $486 = self.rgt;
                                    return $484;
                            }
                        })();
                    case '0':
                        var $487 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $488 = self.val;
                                    var $489 = self.lft;
                                    var $490 = self.rgt;
                                    return Map$get($487)($489);
                            }
                        })();
                    case '1':
                        var $491 = self.slice(0, -1);
                        return (() => {
                            var self = map$3;
                            switch (self._) {
                                case 'Map.new':
                                    return Maybe$none;
                                case 'Map.tie':
                                    var $492 = self.val;
                                    var $493 = self.lft;
                                    var $494 = self.rgt;
                                    return Map$get($491)($494);
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
                var $495 = self.value;
                return Maybe$some(f$4($495));
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
                var $496 = (self - 1n);
                return (() => {
                    var func$3 = Fm$Term$ref(Fm$Name$read("Nat.succ"));
                    var argm$4 = Fm$Term$nat($496);
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
                var $497 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.0")))(Fm$Term$unroll_chr$bits($497));
            case '1':
                var $498 = self.slice(0, -1);
                return Fm$Term$app(Fm$Term$ref(Fm$Name$read("Bits.1")))(Fm$Term$unroll_chr$bits($498));
        }
    })());
    var Fm$Term$unroll_chr = (chrx$1 => (() => {
        var self = chrx$1;
        switch ('u16') {
            case 'u16':
                var $499 = u16_to_word(self);
                return (() => {
                    var term$3 = Fm$Term$ref(Fm$Name$read("Word.from_bits"));
                    var term$4 = Fm$Term$app(term$3)(Fm$Term$nat(16n));
                    var term$5 = Fm$Term$app(term$4)(Fm$Term$unroll_chr$bits(Word$to_bits($499)));
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
                var $500 = self.charCodeAt(0);
                var $501 = self.slice(1);
                return (() => {
                    var char$4 = Fm$Term$chr($500);
                    var term$5 = Fm$Term$ref(Fm$Name$read("String.cons"));
                    var term$6 = Fm$Term$app(term$5)(char$4);
                    var term$7 = Fm$Term$app(term$6)(Fm$Term$str($501));
                    return term$7
                })();
        }
    })());
    var Fm$Term$reduce = (term$1 => (defs$2 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $502 = self.name;
                var $503 = self.indx;
                return term$1;
            case 'Fm.Term.ref':
                var $504 = self.name;
                return (() => {
                    var self = Fm$get($504)(defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($504);
                        case 'Maybe.some':
                            var $505 = self.value;
                            return (() => {
                                var self = $505;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $506 = self.name;
                                        var $507 = self.term;
                                        var $508 = self.type;
                                        var $509 = self.done;
                                        return Fm$Term$reduce($507)(defs$2);
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$1;
            case 'Fm.Term.all':
                var $510 = self.eras;
                var $511 = self.self;
                var $512 = self.name;
                var $513 = self.xtyp;
                var $514 = self.body;
                return term$1;
            case 'Fm.Term.lam':
                var $515 = self.name;
                var $516 = self.body;
                return term$1;
            case 'Fm.Term.app':
                var $517 = self.func;
                var $518 = self.argm;
                return (() => {
                    var func$5 = Fm$Term$reduce($517)(defs$2);
                    return (() => {
                        var self = func$5;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $519 = self.name;
                                var $520 = self.indx;
                                return term$1;
                            case 'Fm.Term.ref':
                                var $521 = self.name;
                                return term$1;
                            case 'Fm.Term.typ':
                                return term$1;
                            case 'Fm.Term.all':
                                var $522 = self.eras;
                                var $523 = self.self;
                                var $524 = self.name;
                                var $525 = self.xtyp;
                                var $526 = self.body;
                                return term$1;
                            case 'Fm.Term.lam':
                                var $527 = self.name;
                                var $528 = self.body;
                                return Fm$Term$reduce($528($518))(defs$2);
                            case 'Fm.Term.app':
                                var $529 = self.func;
                                var $530 = self.argm;
                                return term$1;
                            case 'Fm.Term.let':
                                var $531 = self.name;
                                var $532 = self.expr;
                                var $533 = self.body;
                                return term$1;
                            case 'Fm.Term.def':
                                var $534 = self.name;
                                var $535 = self.expr;
                                var $536 = self.body;
                                return term$1;
                            case 'Fm.Term.ann':
                                var $537 = self.done;
                                var $538 = self.term;
                                var $539 = self.type;
                                return term$1;
                            case 'Fm.Term.gol':
                                var $540 = self.name;
                                var $541 = self.dref;
                                var $542 = self.verb;
                                return term$1;
                            case 'Fm.Term.hol':
                                var $543 = self.path;
                                return term$1;
                            case 'Fm.Term.nat':
                                var $544 = self.natx;
                                return term$1;
                            case 'Fm.Term.chr':
                                var $545 = self.chrx;
                                return term$1;
                            case 'Fm.Term.str':
                                var $546 = self.strx;
                                return term$1;
                            case 'Fm.Term.cse':
                                var $547 = self.path;
                                var $548 = self.expr;
                                var $549 = self.name;
                                var $550 = self.with;
                                var $551 = self.cses;
                                var $552 = self.moti;
                                return term$1;
                        }
                    })()
                })();
            case 'Fm.Term.let':
                var $553 = self.name;
                var $554 = self.expr;
                var $555 = self.body;
                return Fm$Term$reduce($555($554))(defs$2);
            case 'Fm.Term.def':
                var $556 = self.name;
                var $557 = self.expr;
                var $558 = self.body;
                return Fm$Term$reduce($558($557))(defs$2);
            case 'Fm.Term.ann':
                var $559 = self.done;
                var $560 = self.term;
                var $561 = self.type;
                return Fm$Term$reduce($560)(defs$2);
            case 'Fm.Term.gol':
                var $562 = self.name;
                var $563 = self.dref;
                var $564 = self.verb;
                return term$1;
            case 'Fm.Term.hol':
                var $565 = self.path;
                return term$1;
            case 'Fm.Term.nat':
                var $566 = self.natx;
                return Fm$Term$reduce(Fm$Term$unroll_nat($566))(defs$2);
            case 'Fm.Term.chr':
                var $567 = self.chrx;
                return Fm$Term$reduce(Fm$Term$unroll_chr($567))(defs$2);
            case 'Fm.Term.str':
                var $568 = self.strx;
                return Fm$Term$reduce(Fm$Term$unroll_str($568))(defs$2);
            case 'Fm.Term.cse':
                var $569 = self.path;
                var $570 = self.expr;
                var $571 = self.name;
                var $572 = self.with;
                var $573 = self.cses;
                var $574 = self.moti;
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
    var Fm$Term$desugar_cse$motive = (wyth$1 => (moti$2 => (() => {
        var self = wyth$1;
        switch (self._) {
            case 'List.nil':
                return moti$2;
            case 'List.cons':
                var $575 = self.head;
                var $576 = self.tail;
                return (() => {
                    var self = $575;
                    switch (self._) {
                        case 'Fm.Def.new':
                            var $577 = self.name;
                            var $578 = self.term;
                            var $579 = self.type;
                            var $580 = self.done;
                            return Fm$Term$all(Bool$false)("")($577)($579)((s$9 => (x$10 => Fm$Term$desugar_cse$motive($576)(moti$2))));
                    }
                })();
        }
    })()));
    var Fm$Term$desugar_cse$argument = (name$1 => (wyth$2 => (type$3 => (body$4 => (defs$5 => (() => {
        var self = Fm$Term$reduce(type$3)(defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $581 = self.name;
                var $582 = self.indx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $583 = self.head;
                            var $584 = self.tail;
                            return (() => {
                                var self = $583;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $585 = self.name;
                                        var $586 = self.term;
                                        var $587 = self.type;
                                        var $588 = self.done;
                                        return Fm$Term$lam($585)((x$14 => Fm$Term$desugar_cse$argument(name$1)($584)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $589 = self.name;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $590 = self.head;
                            var $591 = self.tail;
                            return (() => {
                                var self = $590;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $592 = self.name;
                                        var $593 = self.term;
                                        var $594 = self.type;
                                        var $595 = self.done;
                                        return Fm$Term$lam($592)((x$13 => Fm$Term$desugar_cse$argument(name$1)($591)(type$3)(body$4)(defs$5)));
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
                                        return Fm$Term$lam($598)((x$12 => Fm$Term$desugar_cse$argument(name$1)($597)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.all':
                var $602 = self.eras;
                var $603 = self.self;
                var $604 = self.name;
                var $605 = self.xtyp;
                var $606 = self.body;
                return Fm$Term$lam(String$flatten(List$cons(name$1)(List$cons(Fm$Name$read("."))(List$cons($604)(List$nil)))))((x$11 => Fm$Term$desugar_cse$argument(name$1)(wyth$2)($606(Fm$Term$var($603)(0n))(Fm$Term$var($604)(0n)))(body$4)(defs$5)));
            case 'Fm.Term.lam':
                var $607 = self.name;
                var $608 = self.body;
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
                                        return Fm$Term$lam($611)((x$14 => Fm$Term$desugar_cse$argument(name$1)($610)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $615 = self.func;
                var $616 = self.argm;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $617 = self.head;
                            var $618 = self.tail;
                            return (() => {
                                var self = $617;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $619 = self.name;
                                        var $620 = self.term;
                                        var $621 = self.type;
                                        var $622 = self.done;
                                        return Fm$Term$lam($619)((x$14 => Fm$Term$desugar_cse$argument(name$1)($618)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.let':
                var $623 = self.name;
                var $624 = self.expr;
                var $625 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $626 = self.head;
                            var $627 = self.tail;
                            return (() => {
                                var self = $626;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $628 = self.name;
                                        var $629 = self.term;
                                        var $630 = self.type;
                                        var $631 = self.done;
                                        return Fm$Term$lam($628)((x$15 => Fm$Term$desugar_cse$argument(name$1)($627)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.def':
                var $632 = self.name;
                var $633 = self.expr;
                var $634 = self.body;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $635 = self.head;
                            var $636 = self.tail;
                            return (() => {
                                var self = $635;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $637 = self.name;
                                        var $638 = self.term;
                                        var $639 = self.type;
                                        var $640 = self.done;
                                        return Fm$Term$lam($637)((x$15 => Fm$Term$desugar_cse$argument(name$1)($636)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.ann':
                var $641 = self.done;
                var $642 = self.term;
                var $643 = self.type;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $644 = self.head;
                            var $645 = self.tail;
                            return (() => {
                                var self = $644;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $646 = self.name;
                                        var $647 = self.term;
                                        var $648 = self.type;
                                        var $649 = self.done;
                                        return Fm$Term$lam($646)((x$15 => Fm$Term$desugar_cse$argument(name$1)($645)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.gol':
                var $650 = self.name;
                var $651 = self.dref;
                var $652 = self.verb;
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
                                        return Fm$Term$lam($655)((x$15 => Fm$Term$desugar_cse$argument(name$1)($654)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.hol':
                var $659 = self.path;
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
            case 'Fm.Term.nat':
                var $666 = self.natx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $667 = self.head;
                            var $668 = self.tail;
                            return (() => {
                                var self = $667;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $669 = self.name;
                                        var $670 = self.term;
                                        var $671 = self.type;
                                        var $672 = self.done;
                                        return Fm$Term$lam($669)((x$13 => Fm$Term$desugar_cse$argument(name$1)($668)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.chr':
                var $673 = self.chrx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $674 = self.head;
                            var $675 = self.tail;
                            return (() => {
                                var self = $674;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $676 = self.name;
                                        var $677 = self.term;
                                        var $678 = self.type;
                                        var $679 = self.done;
                                        return Fm$Term$lam($676)((x$13 => Fm$Term$desugar_cse$argument(name$1)($675)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.str':
                var $680 = self.strx;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $681 = self.head;
                            var $682 = self.tail;
                            return (() => {
                                var self = $681;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $683 = self.name;
                                        var $684 = self.term;
                                        var $685 = self.type;
                                        var $686 = self.done;
                                        return Fm$Term$lam($683)((x$13 => Fm$Term$desugar_cse$argument(name$1)($682)(type$3)(body$4)(defs$5)));
                                }
                            })();
                    }
                })();
            case 'Fm.Term.cse':
                var $687 = self.path;
                var $688 = self.expr;
                var $689 = self.name;
                var $690 = self.with;
                var $691 = self.cses;
                var $692 = self.moti;
                return (() => {
                    var self = wyth$2;
                    switch (self._) {
                        case 'List.nil':
                            return body$4;
                        case 'List.cons':
                            var $693 = self.head;
                            var $694 = self.tail;
                            return (() => {
                                var self = $693;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $695 = self.name;
                                        var $696 = self.term;
                                        var $697 = self.type;
                                        var $698 = self.done;
                                        return Fm$Term$lam($695)((x$18 => Fm$Term$desugar_cse$argument(name$1)($694)(type$3)(body$4)(defs$5)));
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
                var $699 = self.value;
                return Maybe$some($699);
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
                        var $700 = self.name;
                        var $701 = self.indx;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $702 = self.name;
                                        var $703 = self.term;
                                        var $704 = self.type;
                                        var $705 = self.done;
                                        return $703;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.ref':
                        var $706 = self.name;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $707 = self.name;
                                        var $708 = self.term;
                                        var $709 = self.type;
                                        var $710 = self.done;
                                        return $708;
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
                                        var $711 = self.name;
                                        var $712 = self.term;
                                        var $713 = self.type;
                                        var $714 = self.done;
                                        return $712;
                                }
                            })())))));
                            return expr$8
                        })();
                    case 'Fm.Term.all':
                        var $715 = self.eras;
                        var $716 = self.self;
                        var $717 = self.name;
                        var $718 = self.xtyp;
                        var $719 = self.body;
                        return (() => {
                            var got$13 = Maybe$or(Fm$get($717)(cses$4))(Fm$get("_")(cses$4));
                            return (() => {
                                var self = got$13;
                                switch (self._) {
                                    case 'Maybe.none':
                                        return (() => {
                                            var expr$14 = (list_for(wyth$3)(expr$1)((def$14 => (expr$15 => (() => {
                                                var self = def$14;
                                                switch (self._) {
                                                    case 'Fm.Def.new':
                                                        var $720 = self.name;
                                                        var $721 = self.term;
                                                        var $722 = self.type;
                                                        var $723 = self.done;
                                                        return Fm$Term$app(expr$15)($721);
                                                }
                                            })()))));
                                            return expr$14
                                        })();
                                    case 'Maybe.some':
                                        var $724 = self.value;
                                        return (() => {
                                            var argm$15 = Fm$Term$desugar_cse$argument(name$2)(wyth$3)($718)($724)(defs$6);
                                            var expr$16 = Fm$Term$app(expr$1)(argm$15);
                                            var type$17 = $719(Fm$Term$var($716)(0n))(Fm$Term$var($717)(0n));
                                            return Fm$Term$desugar_cse$cases(expr$16)(name$2)(wyth$3)(cses$4)(type$17)(defs$6)(ctxt$7)
                                        })();
                                }
                            })()
                        })();
                    case 'Fm.Term.lam':
                        var $725 = self.name;
                        var $726 = self.body;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $727 = self.name;
                                        var $728 = self.term;
                                        var $729 = self.type;
                                        var $730 = self.done;
                                        return $728;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.app':
                        var $731 = self.func;
                        var $732 = self.argm;
                        return (() => {
                            var expr$10 = (list_for(wyth$3)(expr$1)((def$10 => (expr$11 => Fm$Term$app(expr$11)((() => {
                                var self = def$10;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $733 = self.name;
                                        var $734 = self.term;
                                        var $735 = self.type;
                                        var $736 = self.done;
                                        return $734;
                                }
                            })())))));
                            return expr$10
                        })();
                    case 'Fm.Term.let':
                        var $737 = self.name;
                        var $738 = self.expr;
                        var $739 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $740 = self.name;
                                        var $741 = self.term;
                                        var $742 = self.type;
                                        var $743 = self.done;
                                        return $741;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.def':
                        var $744 = self.name;
                        var $745 = self.expr;
                        var $746 = self.body;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $747 = self.name;
                                        var $748 = self.term;
                                        var $749 = self.type;
                                        var $750 = self.done;
                                        return $748;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.ann':
                        var $751 = self.done;
                        var $752 = self.term;
                        var $753 = self.type;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $754 = self.name;
                                        var $755 = self.term;
                                        var $756 = self.type;
                                        var $757 = self.done;
                                        return $755;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.gol':
                        var $758 = self.name;
                        var $759 = self.dref;
                        var $760 = self.verb;
                        return (() => {
                            var expr$11 = (list_for(wyth$3)(expr$1)((def$11 => (expr$12 => Fm$Term$app(expr$12)((() => {
                                var self = def$11;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $761 = self.name;
                                        var $762 = self.term;
                                        var $763 = self.type;
                                        var $764 = self.done;
                                        return $762;
                                }
                            })())))));
                            return expr$11
                        })();
                    case 'Fm.Term.hol':
                        var $765 = self.path;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $766 = self.name;
                                        var $767 = self.term;
                                        var $768 = self.type;
                                        var $769 = self.done;
                                        return $767;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.nat':
                        var $770 = self.natx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $771 = self.name;
                                        var $772 = self.term;
                                        var $773 = self.type;
                                        var $774 = self.done;
                                        return $772;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.chr':
                        var $775 = self.chrx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $776 = self.name;
                                        var $777 = self.term;
                                        var $778 = self.type;
                                        var $779 = self.done;
                                        return $777;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.str':
                        var $780 = self.strx;
                        return (() => {
                            var expr$9 = (list_for(wyth$3)(expr$1)((def$9 => (expr$10 => Fm$Term$app(expr$10)((() => {
                                var self = def$9;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $781 = self.name;
                                        var $782 = self.term;
                                        var $783 = self.type;
                                        var $784 = self.done;
                                        return $782;
                                }
                            })())))));
                            return expr$9
                        })();
                    case 'Fm.Term.cse':
                        var $785 = self.path;
                        var $786 = self.expr;
                        var $787 = self.name;
                        var $788 = self.with;
                        var $789 = self.cses;
                        var $790 = self.moti;
                        return (() => {
                            var expr$14 = (list_for(wyth$3)(expr$1)((def$14 => (expr$15 => Fm$Term$app(expr$15)((() => {
                                var self = def$14;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $791 = self.name;
                                        var $792 = self.term;
                                        var $793 = self.type;
                                        var $794 = self.done;
                                        return $792;
                                }
                            })())))));
                            return expr$14
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
                var $795 = self.name;
                var $796 = self.indx;
                return Maybe$none;
            case 'Fm.Term.ref':
                var $797 = self.name;
                return Maybe$none;
            case 'Fm.Term.typ':
                return Maybe$none;
            case 'Fm.Term.all':
                var $798 = self.eras;
                var $799 = self.self;
                var $800 = self.name;
                var $801 = self.xtyp;
                var $802 = self.body;
                return (() => {
                    var moti$14 = Fm$Term$desugar_cse$motive(with$3)(moti$5);
                    var argm$15 = Fm$Term$desugar_cse$argument(name$2)(List$nil)($801)(moti$14)(defs$7);
                    var expr$16 = Fm$Term$app(expr$1)(argm$15);
                    var type$17 = $802(Fm$Term$var($799)(0n))(Fm$Term$var($800)(0n));
                    return Maybe$some(Fm$Term$desugar_cse$cases(expr$16)(name$2)(with$3)(cses$4)(type$17)(defs$7)(ctxt$8))
                })();
            case 'Fm.Term.lam':
                var $803 = self.name;
                var $804 = self.body;
                return Maybe$none;
            case 'Fm.Term.app':
                var $805 = self.func;
                var $806 = self.argm;
                return Maybe$none;
            case 'Fm.Term.let':
                var $807 = self.name;
                var $808 = self.expr;
                var $809 = self.body;
                return Maybe$none;
            case 'Fm.Term.def':
                var $810 = self.name;
                var $811 = self.expr;
                var $812 = self.body;
                return Maybe$none;
            case 'Fm.Term.ann':
                var $813 = self.done;
                var $814 = self.term;
                var $815 = self.type;
                return Maybe$none;
            case 'Fm.Term.gol':
                var $816 = self.name;
                var $817 = self.dref;
                var $818 = self.verb;
                return Maybe$none;
            case 'Fm.Term.hol':
                var $819 = self.path;
                return Maybe$none;
            case 'Fm.Term.nat':
                var $820 = self.natx;
                return Maybe$none;
            case 'Fm.Term.chr':
                var $821 = self.chrx;
                return Maybe$none;
            case 'Fm.Term.str':
                var $822 = self.strx;
                return Maybe$none;
            case 'Fm.Term.cse':
                var $823 = self.path;
                var $824 = self.expr;
                var $825 = self.name;
                var $826 = self.with;
                var $827 = self.cses;
                var $828 = self.moti;
                return Maybe$none;
        }
    })()))))))));
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
                var $829 = self.value;
                return $829(Bits$nil);
        }
    })());
    var U16$to_word = (a$1 => (() => {
        var self = a$1;
        switch ('u16') {
            case 'u16':
                var $830 = u16_to_word(self);
                return $830;
        }
    })());
    var Fm$Term$serialize$go = (term$1 => (depth$2 => (init$3 => (x$4 => (() => {
        if (term$1.serial) return term$1.serial;
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $831 = self.name;
                var $832 = self.indx;
                return (() => {
                    var self = ($832 >= init$3);
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits(Nat$pred((depth$2 - $832 <= 0n ? 0n : depth$2 - $832)))));
                                return term$1.serial = Bits$0(Bits$0(Bits$1(name$7(x$4))))
                            })();
                        case 'false':
                            return (() => {
                                var name$7 = a1 => (a1 + (nat_to_bits($832)));
                                return term$1.serial = Bits$0(Bits$1(Bits$0(name$7(x$4))))
                            })();
                    }
                })();
            case 'Fm.Term.ref':
                var $833 = self.name;
                return (() => {
                    var name$6 = a1 => (a1 + (fm_name_to_bits($833)));
                    return term$1.serial = Bits$0(Bits$0(Bits$0(name$6(x$4))))
                })();
            case 'Fm.Term.typ':
                return term$1.serial = Bits$0(Bits$1(Bits$1(x$4)));
            case 'Fm.Term.all':
                var $834 = self.eras;
                var $835 = self.self;
                var $836 = self.name;
                var $837 = self.xtyp;
                var $838 = self.body;
                return (() => {
                    var self$10 = a1 => (a1 + (fm_name_to_bits($835)));
                    var xtyp$11 = Fm$Term$serialize$go($837)(depth$2)(init$3);
                    var body$12 = Fm$Term$serialize$go($838(Fm$Term$var($835)(depth$2))(Fm$Term$var($836)(Nat$succ(depth$2))))(Nat$succ(Nat$succ(depth$2)))(init$3);
                    return term$1.serial = Bits$1(Bits$0(Bits$0(self$10(xtyp$11(body$12(x$4))))))
                })();
            case 'Fm.Term.lam':
                var $839 = self.name;
                var $840 = self.body;
                return (() => {
                    var body$7 = Fm$Term$serialize$go($840(Fm$Term$var($839)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return term$1.serial = Bits$1(Bits$0(Bits$1(body$7(x$4))))
                })();
            case 'Fm.Term.app':
                var $841 = self.func;
                var $842 = self.argm;
                return (() => {
                    var func$7 = Fm$Term$serialize$go($841)(depth$2)(init$3);
                    var argm$8 = Fm$Term$serialize$go($842)(depth$2)(init$3);
                    return term$1.serial = Bits$1(Bits$1(Bits$0(func$7(argm$8(x$4)))))
                })();
            case 'Fm.Term.let':
                var $843 = self.name;
                var $844 = self.expr;
                var $845 = self.body;
                return (() => {
                    var expr$8 = Fm$Term$serialize$go($844)(depth$2)(init$3);
                    var body$9 = Fm$Term$serialize$go($845(Fm$Term$var($843)(depth$2)))(Nat$succ(depth$2))(init$3);
                    return term$1.serial = Bits$1(Bits$1(Bits$1(expr$8(body$9(x$4)))))
                })();
            case 'Fm.Term.def':
                var $846 = self.name;
                var $847 = self.expr;
                var $848 = self.body;
                return term$1.serial = Fm$Term$serialize$go($848($847))(depth$2)(init$3)(x$4);
            case 'Fm.Term.ann':
                var $849 = self.done;
                var $850 = self.term;
                var $851 = self.type;
                return term$1.serial = Fm$Term$serialize$go($850)(depth$2)(init$3)(x$4);
            case 'Fm.Term.gol':
                var $852 = self.name;
                var $853 = self.dref;
                var $854 = self.verb;
                return (() => {
                    var name$8 = a1 => (a1 + (fm_name_to_bits($852)));
                    return term$1.serial = Bits$0(Bits$0(Bits$0(name$8(x$4))))
                })();
            case 'Fm.Term.hol':
                var $855 = self.path;
                return term$1.serial = x$4;
            case 'Fm.Term.nat':
                var $856 = self.natx;
                return term$1.serial = Bits$0(Bits$0(Bits$0((x$4 + (nat_to_bits($856))))));
            case 'Fm.Term.chr':
                var $857 = self.chrx;
                return term$1.serial = Bits$0(Bits$0(Bits$0((x$4 + Word$to_bits(U16$to_word($857))))));
            case 'Fm.Term.str':
                var $858 = self.strx;
                return term$1.serial = Fm$Term$serialize$go(Fm$Term$unroll_str($858))(depth$2)(init$3)(x$4);
            case 'Fm.Term.cse':
                var $859 = self.path;
                var $860 = self.expr;
                var $861 = self.name;
                var $862 = self.with;
                var $863 = self.cses;
                var $864 = self.moti;
                return term$1.serial = x$4;
        }
    })()))));
    var Fm$Term$serialize = (term$1 => (depth$2 => Fm$Term$serialize$go(term$1)(depth$2)(depth$2)(Bits$nil)));
    var Bool$or = a0 => a1 => (a0 || a1);
    var Bits$eql = a0 => a1 => (a1 === a0);
    var Set$has = (bits$1 => (set$2 => (() => {
        var self = Map$get(bits$1)(set$2);
        switch (self._) {
            case 'Maybe.none':
                return Bool$false;
            case 'Maybe.some':
                var $865 = self.value;
                return Bool$true;
        }
    })()));
    var Fm$Term$normalize = (term$1 => (defs$2 => (() => {
        var self = Fm$Term$reduce(term$1)(defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $866 = self.name;
                var $867 = self.indx;
                return Fm$Term$var($866)($867);
            case 'Fm.Term.ref':
                var $868 = self.name;
                return Fm$Term$ref($868);
            case 'Fm.Term.typ':
                return Fm$Term$typ;
            case 'Fm.Term.all':
                var $869 = self.eras;
                var $870 = self.self;
                var $871 = self.name;
                var $872 = self.xtyp;
                var $873 = self.body;
                return Fm$Term$all($869)($870)($871)(Fm$Term$normalize($872)(defs$2))((s$8 => (x$9 => Fm$Term$normalize($873(s$8)(x$9))(defs$2))));
            case 'Fm.Term.lam':
                var $874 = self.name;
                var $875 = self.body;
                return Fm$Term$lam($874)((x$5 => Fm$Term$normalize($875(x$5))(defs$2)));
            case 'Fm.Term.app':
                var $876 = self.func;
                var $877 = self.argm;
                return Fm$Term$app(Fm$Term$normalize($876)(defs$2))(Fm$Term$normalize($877)(defs$2));
            case 'Fm.Term.let':
                var $878 = self.name;
                var $879 = self.expr;
                var $880 = self.body;
                return Fm$Term$let($878)(Fm$Term$normalize($879)(defs$2))((x$6 => Fm$Term$normalize($880(x$6))(defs$2)));
            case 'Fm.Term.def':
                var $881 = self.name;
                var $882 = self.expr;
                var $883 = self.body;
                return Fm$Term$def($881)(Fm$Term$normalize($882)(defs$2))((x$6 => Fm$Term$normalize($883(x$6))(defs$2)));
            case 'Fm.Term.ann':
                var $884 = self.done;
                var $885 = self.term;
                var $886 = self.type;
                return Fm$Term$ann($884)(Fm$Term$normalize($885)(defs$2))(Fm$Term$normalize($886)(defs$2));
            case 'Fm.Term.gol':
                var $887 = self.name;
                var $888 = self.dref;
                var $889 = self.verb;
                return Fm$Term$gol($887)($888)($889);
            case 'Fm.Term.hol':
                var $890 = self.path;
                return Fm$Term$hol($890);
            case 'Fm.Term.nat':
                var $891 = self.natx;
                return Fm$Term$nat($891);
            case 'Fm.Term.chr':
                var $892 = self.chrx;
                return Fm$Term$chr($892);
            case 'Fm.Term.str':
                var $893 = self.strx;
                return Fm$Term$str($893);
            case 'Fm.Term.cse':
                var $894 = self.path;
                var $895 = self.expr;
                var $896 = self.name;
                var $897 = self.with;
                var $898 = self.cses;
                var $899 = self.moti;
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
            var self = ((bh$9 === ah$8) || Set$has(id$10)(seen$5));
            switch (self ? 'true' : 'false') {
                case 'true':
                    return Monad$pure(Fm$Check$monad)(Bool$true);
                case 'false':
                    return (() => {
                        var self = a1$6;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $900 = self.name;
                                var $901 = self.indx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $902 = self.name;
                                            var $903 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $904 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $905 = self.eras;
                                            var $906 = self.self;
                                            var $907 = self.name;
                                            var $908 = self.xtyp;
                                            var $909 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $910 = self.name;
                                            var $911 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $912 = self.func;
                                            var $913 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $914 = self.name;
                                            var $915 = self.expr;
                                            var $916 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $917 = self.name;
                                            var $918 = self.expr;
                                            var $919 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $920 = self.done;
                                            var $921 = self.term;
                                            var $922 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $923 = self.name;
                                            var $924 = self.dref;
                                            var $925 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $926 = self.path;
                                            return Fm$Term$equal$patch($926)(a$1);
                                        case 'Fm.Term.nat':
                                            var $927 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $928 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $929 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $930 = self.path;
                                            var $931 = self.expr;
                                            var $932 = self.name;
                                            var $933 = self.with;
                                            var $934 = self.cses;
                                            var $935 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ref':
                                var $936 = self.name;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $937 = self.name;
                                            var $938 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $939 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $940 = self.eras;
                                            var $941 = self.self;
                                            var $942 = self.name;
                                            var $943 = self.xtyp;
                                            var $944 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $945 = self.name;
                                            var $946 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $947 = self.func;
                                            var $948 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $949 = self.name;
                                            var $950 = self.expr;
                                            var $951 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $952 = self.name;
                                            var $953 = self.expr;
                                            var $954 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $955 = self.done;
                                            var $956 = self.term;
                                            var $957 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $958 = self.name;
                                            var $959 = self.dref;
                                            var $960 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $961 = self.path;
                                            return Fm$Term$equal$patch($961)(a$1);
                                        case 'Fm.Term.nat':
                                            var $962 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $963 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $964 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $965 = self.path;
                                            var $966 = self.expr;
                                            var $967 = self.name;
                                            var $968 = self.with;
                                            var $969 = self.cses;
                                            var $970 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.typ':
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $971 = self.name;
                                            var $972 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $973 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $974 = self.eras;
                                            var $975 = self.self;
                                            var $976 = self.name;
                                            var $977 = self.xtyp;
                                            var $978 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $979 = self.name;
                                            var $980 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $981 = self.func;
                                            var $982 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $983 = self.name;
                                            var $984 = self.expr;
                                            var $985 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $986 = self.name;
                                            var $987 = self.expr;
                                            var $988 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $989 = self.done;
                                            var $990 = self.term;
                                            var $991 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $992 = self.name;
                                            var $993 = self.dref;
                                            var $994 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $995 = self.path;
                                            return Fm$Term$equal$patch($995)(a$1);
                                        case 'Fm.Term.nat':
                                            var $996 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $997 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $998 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $999 = self.path;
                                            var $1000 = self.expr;
                                            var $1001 = self.name;
                                            var $1002 = self.with;
                                            var $1003 = self.cses;
                                            var $1004 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.all':
                                var $1005 = self.eras;
                                var $1006 = self.self;
                                var $1007 = self.name;
                                var $1008 = self.xtyp;
                                var $1009 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1010 = self.name;
                                            var $1011 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1012 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1013 = self.eras;
                                            var $1014 = self.self;
                                            var $1015 = self.name;
                                            var $1016 = self.xtyp;
                                            var $1017 = self.body;
                                            return (() => {
                                                var seen$21 = Set$set(id$10)(seen$5);
                                                var a1_body$22 = $1009(Fm$Term$var($1006)(lv$4))(Fm$Term$var($1007)(Nat$succ(lv$4)));
                                                var b1_body$23 = $1017(Fm$Term$var($1014)(lv$4))(Fm$Term$var($1015)(Nat$succ(lv$4)));
                                                var eq_self$24 = ($1006 === $1014);
                                                return (() => {
                                                    var self = eq_self$24;
                                                    switch (self ? 'true' : 'false') {
                                                        case 'true':
                                                            return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1008)($1016)(defs$3)(lv$4)(seen$21))((eq_type$25 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$22)(b1_body$23)(defs$3)(Nat$succ(Nat$succ(lv$4)))(seen$21))((eq_body$26 => Monad$pure(Fm$Check$monad)((eq_type$25 && eq_body$26))))));
                                                        case 'false':
                                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                                    }
                                                })()
                                            })();
                                        case 'Fm.Term.lam':
                                            var $1018 = self.name;
                                            var $1019 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1020 = self.func;
                                            var $1021 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1022 = self.name;
                                            var $1023 = self.expr;
                                            var $1024 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1025 = self.name;
                                            var $1026 = self.expr;
                                            var $1027 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1028 = self.done;
                                            var $1029 = self.term;
                                            var $1030 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1031 = self.name;
                                            var $1032 = self.dref;
                                            var $1033 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1034 = self.path;
                                            return Fm$Term$equal$patch($1034)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1035 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1036 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1037 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1038 = self.path;
                                            var $1039 = self.expr;
                                            var $1040 = self.name;
                                            var $1041 = self.with;
                                            var $1042 = self.cses;
                                            var $1043 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.lam':
                                var $1044 = self.name;
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
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                var a1_body$16 = $1045(Fm$Term$var($1044)(lv$4));
                                                var b1_body$17 = $1055(Fm$Term$var($1054)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$16)(b1_body$17)(defs$3)(Nat$succ(lv$4))(seen$15))((eq_body$18 => Monad$pure(Fm$Check$monad)(eq_body$18)))
                                            })();
                                        case 'Fm.Term.app':
                                            var $1056 = self.func;
                                            var $1057 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1058 = self.name;
                                            var $1059 = self.expr;
                                            var $1060 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
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
                                        case 'Fm.Term.cse':
                                            var $1074 = self.path;
                                            var $1075 = self.expr;
                                            var $1076 = self.name;
                                            var $1077 = self.with;
                                            var $1078 = self.cses;
                                            var $1079 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.app':
                                var $1080 = self.func;
                                var $1081 = self.argm;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1082 = self.name;
                                            var $1083 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1084 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1085 = self.eras;
                                            var $1086 = self.self;
                                            var $1087 = self.name;
                                            var $1088 = self.xtyp;
                                            var $1089 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1090 = self.name;
                                            var $1091 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1092 = self.func;
                                            var $1093 = self.argm;
                                            return (() => {
                                                var seen$15 = Set$set(id$10)(seen$5);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1080)($1092)(defs$3)(lv$4)(seen$15))((eq_func$16 => Monad$bind(Fm$Check$monad)(Fm$Term$equal($1081)($1093)(defs$3)(lv$4)(seen$15))((eq_argm$17 => Monad$pure(Fm$Check$monad)((eq_func$16 && eq_argm$17))))))
                                            })();
                                        case 'Fm.Term.let':
                                            var $1094 = self.name;
                                            var $1095 = self.expr;
                                            var $1096 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1097 = self.name;
                                            var $1098 = self.expr;
                                            var $1099 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1100 = self.done;
                                            var $1101 = self.term;
                                            var $1102 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1103 = self.name;
                                            var $1104 = self.dref;
                                            var $1105 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1106 = self.path;
                                            return Fm$Term$equal$patch($1106)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1107 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1108 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1109 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1110 = self.path;
                                            var $1111 = self.expr;
                                            var $1112 = self.name;
                                            var $1113 = self.with;
                                            var $1114 = self.cses;
                                            var $1115 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.let':
                                var $1116 = self.name;
                                var $1117 = self.expr;
                                var $1118 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1119 = self.name;
                                            var $1120 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1121 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1122 = self.eras;
                                            var $1123 = self.self;
                                            var $1124 = self.name;
                                            var $1125 = self.xtyp;
                                            var $1126 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1127 = self.name;
                                            var $1128 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1129 = self.func;
                                            var $1130 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1131 = self.name;
                                            var $1132 = self.expr;
                                            var $1133 = self.body;
                                            return (() => {
                                                var seen$17 = Set$set(id$10)(seen$5);
                                                var a1_body$18 = $1118(Fm$Term$var($1116)(lv$4));
                                                var b1_body$19 = $1133(Fm$Term$var($1131)(lv$4));
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1117)($1132)(defs$3)(lv$4)(seen$17))((eq_expr$20 => Monad$bind(Fm$Check$monad)(Fm$Term$equal(a1_body$18)(b1_body$19)(defs$3)(Nat$succ(lv$4))(seen$17))((eq_body$21 => Monad$pure(Fm$Check$monad)((eq_expr$20 && eq_body$21))))))
                                            })();
                                        case 'Fm.Term.def':
                                            var $1134 = self.name;
                                            var $1135 = self.expr;
                                            var $1136 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1137 = self.done;
                                            var $1138 = self.term;
                                            var $1139 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1140 = self.name;
                                            var $1141 = self.dref;
                                            var $1142 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1143 = self.path;
                                            return Fm$Term$equal$patch($1143)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1144 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1145 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1146 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1147 = self.path;
                                            var $1148 = self.expr;
                                            var $1149 = self.name;
                                            var $1150 = self.with;
                                            var $1151 = self.cses;
                                            var $1152 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.def':
                                var $1153 = self.name;
                                var $1154 = self.expr;
                                var $1155 = self.body;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1156 = self.name;
                                            var $1157 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1158 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1159 = self.eras;
                                            var $1160 = self.self;
                                            var $1161 = self.name;
                                            var $1162 = self.xtyp;
                                            var $1163 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1164 = self.name;
                                            var $1165 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1166 = self.func;
                                            var $1167 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1168 = self.name;
                                            var $1169 = self.expr;
                                            var $1170 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1171 = self.name;
                                            var $1172 = self.expr;
                                            var $1173 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1174 = self.done;
                                            var $1175 = self.term;
                                            var $1176 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1177 = self.name;
                                            var $1178 = self.dref;
                                            var $1179 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1180 = self.path;
                                            return Fm$Term$equal$patch($1180)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1181 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1182 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1183 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1184 = self.path;
                                            var $1185 = self.expr;
                                            var $1186 = self.name;
                                            var $1187 = self.with;
                                            var $1188 = self.cses;
                                            var $1189 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.ann':
                                var $1190 = self.done;
                                var $1191 = self.term;
                                var $1192 = self.type;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1193 = self.name;
                                            var $1194 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1195 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1196 = self.eras;
                                            var $1197 = self.self;
                                            var $1198 = self.name;
                                            var $1199 = self.xtyp;
                                            var $1200 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1201 = self.name;
                                            var $1202 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1203 = self.func;
                                            var $1204 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1205 = self.name;
                                            var $1206 = self.expr;
                                            var $1207 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1208 = self.name;
                                            var $1209 = self.expr;
                                            var $1210 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1211 = self.done;
                                            var $1212 = self.term;
                                            var $1213 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1214 = self.name;
                                            var $1215 = self.dref;
                                            var $1216 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1217 = self.path;
                                            return Fm$Term$equal$patch($1217)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1218 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1219 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1220 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1221 = self.path;
                                            var $1222 = self.expr;
                                            var $1223 = self.name;
                                            var $1224 = self.with;
                                            var $1225 = self.cses;
                                            var $1226 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.gol':
                                var $1227 = self.name;
                                var $1228 = self.dref;
                                var $1229 = self.verb;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1230 = self.name;
                                            var $1231 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1232 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1233 = self.eras;
                                            var $1234 = self.self;
                                            var $1235 = self.name;
                                            var $1236 = self.xtyp;
                                            var $1237 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1238 = self.name;
                                            var $1239 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1240 = self.func;
                                            var $1241 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1242 = self.name;
                                            var $1243 = self.expr;
                                            var $1244 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1245 = self.name;
                                            var $1246 = self.expr;
                                            var $1247 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1248 = self.done;
                                            var $1249 = self.term;
                                            var $1250 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1251 = self.name;
                                            var $1252 = self.dref;
                                            var $1253 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1254 = self.path;
                                            return Fm$Term$equal$patch($1254)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1255 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1256 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1257 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1258 = self.path;
                                            var $1259 = self.expr;
                                            var $1260 = self.name;
                                            var $1261 = self.with;
                                            var $1262 = self.cses;
                                            var $1263 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.hol':
                                var $1264 = self.path;
                                return Fm$Term$equal$patch($1264)(b$2);
                            case 'Fm.Term.nat':
                                var $1265 = self.natx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1266 = self.name;
                                            var $1267 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1268 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1269 = self.eras;
                                            var $1270 = self.self;
                                            var $1271 = self.name;
                                            var $1272 = self.xtyp;
                                            var $1273 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1274 = self.name;
                                            var $1275 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1276 = self.func;
                                            var $1277 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1278 = self.name;
                                            var $1279 = self.expr;
                                            var $1280 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1281 = self.name;
                                            var $1282 = self.expr;
                                            var $1283 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1284 = self.done;
                                            var $1285 = self.term;
                                            var $1286 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1287 = self.name;
                                            var $1288 = self.dref;
                                            var $1289 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1290 = self.path;
                                            return Fm$Term$equal$patch($1290)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1291 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1292 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1293 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1294 = self.path;
                                            var $1295 = self.expr;
                                            var $1296 = self.name;
                                            var $1297 = self.with;
                                            var $1298 = self.cses;
                                            var $1299 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.chr':
                                var $1300 = self.chrx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1301 = self.name;
                                            var $1302 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1303 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1304 = self.eras;
                                            var $1305 = self.self;
                                            var $1306 = self.name;
                                            var $1307 = self.xtyp;
                                            var $1308 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1309 = self.name;
                                            var $1310 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1311 = self.func;
                                            var $1312 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1313 = self.name;
                                            var $1314 = self.expr;
                                            var $1315 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1316 = self.name;
                                            var $1317 = self.expr;
                                            var $1318 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1319 = self.done;
                                            var $1320 = self.term;
                                            var $1321 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1322 = self.name;
                                            var $1323 = self.dref;
                                            var $1324 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1325 = self.path;
                                            return Fm$Term$equal$patch($1325)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1326 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1327 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1328 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1329 = self.path;
                                            var $1330 = self.expr;
                                            var $1331 = self.name;
                                            var $1332 = self.with;
                                            var $1333 = self.cses;
                                            var $1334 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.str':
                                var $1335 = self.strx;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1336 = self.name;
                                            var $1337 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1338 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1339 = self.eras;
                                            var $1340 = self.self;
                                            var $1341 = self.name;
                                            var $1342 = self.xtyp;
                                            var $1343 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1344 = self.name;
                                            var $1345 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1346 = self.func;
                                            var $1347 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1348 = self.name;
                                            var $1349 = self.expr;
                                            var $1350 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1351 = self.name;
                                            var $1352 = self.expr;
                                            var $1353 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1354 = self.done;
                                            var $1355 = self.term;
                                            var $1356 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1357 = self.name;
                                            var $1358 = self.dref;
                                            var $1359 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1360 = self.path;
                                            return Fm$Term$equal$patch($1360)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1361 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1362 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1363 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1364 = self.path;
                                            var $1365 = self.expr;
                                            var $1366 = self.name;
                                            var $1367 = self.with;
                                            var $1368 = self.cses;
                                            var $1369 = self.moti;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                    }
                                })();
                            case 'Fm.Term.cse':
                                var $1370 = self.path;
                                var $1371 = self.expr;
                                var $1372 = self.name;
                                var $1373 = self.with;
                                var $1374 = self.cses;
                                var $1375 = self.moti;
                                return (() => {
                                    var self = b1$7;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1376 = self.name;
                                            var $1377 = self.indx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ref':
                                            var $1378 = self.name;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.typ':
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.all':
                                            var $1379 = self.eras;
                                            var $1380 = self.self;
                                            var $1381 = self.name;
                                            var $1382 = self.xtyp;
                                            var $1383 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.lam':
                                            var $1384 = self.name;
                                            var $1385 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.app':
                                            var $1386 = self.func;
                                            var $1387 = self.argm;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.let':
                                            var $1388 = self.name;
                                            var $1389 = self.expr;
                                            var $1390 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.def':
                                            var $1391 = self.name;
                                            var $1392 = self.expr;
                                            var $1393 = self.body;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.ann':
                                            var $1394 = self.done;
                                            var $1395 = self.term;
                                            var $1396 = self.type;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.gol':
                                            var $1397 = self.name;
                                            var $1398 = self.dref;
                                            var $1399 = self.verb;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.hol':
                                            var $1400 = self.path;
                                            return Fm$Term$equal$patch($1400)(a$1);
                                        case 'Fm.Term.nat':
                                            var $1401 = self.natx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.chr':
                                            var $1402 = self.chrx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.str':
                                            var $1403 = self.strx;
                                            return Monad$pure(Fm$Check$monad)(Bool$false);
                                        case 'Fm.Term.cse':
                                            var $1404 = self.path;
                                            var $1405 = self.expr;
                                            var $1406 = self.name;
                                            var $1407 = self.with;
                                            var $1408 = self.cses;
                                            var $1409 = self.moti;
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
                var $1410 = self.name;
                var $1411 = self.indx;
                return (() => {
                    var self = List$at_last($1411)(ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(type$2)(List$cons(Fm$Error$undefined_reference($1410))(List$nil));
                        case 'Maybe.some':
                            var $1412 = self.value;
                            return Monad$pure(Fm$Check$monad)((() => {
                                var self = $1412;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $1413 = self.fst;
                                        var $1414 = self.snd;
                                        return $1414;
                                }
                            })());
                    }
                })();
            case 'Fm.Term.ref':
                var $1415 = self.name;
                return (() => {
                    var self = Fm$get($1415)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(type$2)(List$cons(Fm$Error$undefined_reference($1415))(List$nil));
                        case 'Maybe.some':
                            var $1416 = self.value;
                            return Monad$pure(Fm$Check$monad)((() => {
                                var self = $1416;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1417 = self.name;
                                        var $1418 = self.term;
                                        var $1419 = self.type;
                                        var $1420 = self.done;
                                        return $1419;
                                }
                            })());
                    }
                })();
            case 'Fm.Term.typ':
                return Monad$pure(Fm$Check$monad)(Fm$Term$typ);
            case 'Fm.Term.all':
                var $1421 = self.eras;
                var $1422 = self.self;
                var $1423 = self.name;
                var $1424 = self.xtyp;
                var $1425 = self.body;
                return (() => {
                    var ctx_size$11 = List$length(ctx$4);
                    var self_var$12 = Fm$Term$var($1422)(ctx_size$11);
                    var body_var$13 = Fm$Term$var($1423)(Nat$succ(ctx_size$11));
                    var body_ctx$14 = List$cons(Pair$new($1423)($1424))(List$cons(Pair$new($1422)(term$1))(ctx$4));
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1424)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($15 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1425(self_var$12)(body_var$13))(Maybe$some(Fm$Term$typ))(defs$3)(body_ctx$14)(Fm$MPath$1(path$5)))(($16 => Monad$pure(Fm$Check$monad)(Fm$Term$typ)))))
                })();
            case 'Fm.Term.lam':
                var $1426 = self.name;
                var $1427 = self.body;
                return (() => {
                    var self = type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Check$result(type$2)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                        case 'Maybe.some':
                            var $1428 = self.value;
                            return (() => {
                                var typv$9 = Fm$Term$reduce($1428)(defs$3);
                                return (() => {
                                    var self = typv$9;
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $1429 = self.name;
                                            var $1430 = self.indx;
                                            return (() => {
                                                var expected$12 = Either$left("Function");
                                                var detected$13 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.ref':
                                            var $1431 = self.name;
                                            return (() => {
                                                var expected$11 = Either$left("Function");
                                                var detected$12 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.typ':
                                            return (() => {
                                                var expected$10 = Either$left("Function");
                                                var detected$11 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$10)(detected$11)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.all':
                                            var $1432 = self.eras;
                                            var $1433 = self.self;
                                            var $1434 = self.name;
                                            var $1435 = self.xtyp;
                                            var $1436 = self.body;
                                            return (() => {
                                                var ctx_size$15 = List$length(ctx$4);
                                                var self_var$16 = term$1;
                                                var body_var$17 = Fm$Term$var($1426)(ctx_size$15);
                                                var body_typ$18 = $1436(self_var$16)(body_var$17);
                                                var body_ctx$19 = List$cons(Pair$new($1426)($1435))(ctx$4);
                                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1427(body_var$17))(Maybe$some(body_typ$18))(defs$3)(body_ctx$19)(Fm$MPath$0(path$5)))(($20 => Monad$pure(Fm$Check$monad)($1428)))
                                            })();
                                        case 'Fm.Term.lam':
                                            var $1437 = self.name;
                                            var $1438 = self.body;
                                            return (() => {
                                                var expected$12 = Either$left("Function");
                                                var detected$13 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.app':
                                            var $1439 = self.func;
                                            var $1440 = self.argm;
                                            return (() => {
                                                var expected$12 = Either$left("Function");
                                                var detected$13 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.let':
                                            var $1441 = self.name;
                                            var $1442 = self.expr;
                                            var $1443 = self.body;
                                            return (() => {
                                                var expected$13 = Either$left("Function");
                                                var detected$14 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.def':
                                            var $1444 = self.name;
                                            var $1445 = self.expr;
                                            var $1446 = self.body;
                                            return (() => {
                                                var expected$13 = Either$left("Function");
                                                var detected$14 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.ann':
                                            var $1447 = self.done;
                                            var $1448 = self.term;
                                            var $1449 = self.type;
                                            return (() => {
                                                var expected$13 = Either$left("Function");
                                                var detected$14 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.gol':
                                            var $1450 = self.name;
                                            var $1451 = self.dref;
                                            var $1452 = self.verb;
                                            return (() => {
                                                var expected$13 = Either$left("Function");
                                                var detected$14 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.hol':
                                            var $1453 = self.path;
                                            return (() => {
                                                var expected$11 = Either$left("Function");
                                                var detected$12 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.nat':
                                            var $1454 = self.natx;
                                            return (() => {
                                                var expected$11 = Either$left("Function");
                                                var detected$12 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.chr':
                                            var $1455 = self.chrx;
                                            return (() => {
                                                var expected$11 = Either$left("Function");
                                                var detected$12 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.str':
                                            var $1456 = self.strx;
                                            return (() => {
                                                var expected$11 = Either$left("Function");
                                                var detected$12 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                            })();
                                        case 'Fm.Term.cse':
                                            var $1457 = self.path;
                                            var $1458 = self.expr;
                                            var $1459 = self.name;
                                            var $1460 = self.with;
                                            var $1461 = self.cses;
                                            var $1462 = self.moti;
                                            return (() => {
                                                var expected$16 = Either$left("Function");
                                                var detected$17 = Either$right($1428);
                                                return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$16)(detected$17)(ctx$4))(List$nil))
                                            })();
                                    }
                                })()
                            })();
                    }
                })();
            case 'Fm.Term.app':
                var $1463 = self.func;
                var $1464 = self.argm;
                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1463)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((func_typ$8 => (() => {
                    var func_typ$9 = Fm$Term$reduce(func_typ$8)(defs$3);
                    return (() => {
                        var self = func_typ$9;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $1465 = self.name;
                                var $1466 = self.indx;
                                return (() => {
                                    var expected$12 = Either$left("Function");
                                    var detected$13 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.ref':
                                var $1467 = self.name;
                                return (() => {
                                    var expected$11 = Either$left("Function");
                                    var detected$12 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.typ':
                                return (() => {
                                    var expected$10 = Either$left("Function");
                                    var detected$11 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$10)(detected$11)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.all':
                                var $1468 = self.eras;
                                var $1469 = self.self;
                                var $1470 = self.name;
                                var $1471 = self.xtyp;
                                var $1472 = self.body;
                                return Monad$bind(Fm$Check$monad)(Fm$Term$check($1464)(Maybe$some($1471))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($15 => Monad$pure(Fm$Check$monad)($1472($1463)($1464))));
                            case 'Fm.Term.lam':
                                var $1473 = self.name;
                                var $1474 = self.body;
                                return (() => {
                                    var expected$12 = Either$left("Function");
                                    var detected$13 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.app':
                                var $1475 = self.func;
                                var $1476 = self.argm;
                                return (() => {
                                    var expected$12 = Either$left("Function");
                                    var detected$13 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$12)(detected$13)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.let':
                                var $1477 = self.name;
                                var $1478 = self.expr;
                                var $1479 = self.body;
                                return (() => {
                                    var expected$13 = Either$left("Function");
                                    var detected$14 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.def':
                                var $1480 = self.name;
                                var $1481 = self.expr;
                                var $1482 = self.body;
                                return (() => {
                                    var expected$13 = Either$left("Function");
                                    var detected$14 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.ann':
                                var $1483 = self.done;
                                var $1484 = self.term;
                                var $1485 = self.type;
                                return (() => {
                                    var expected$13 = Either$left("Function");
                                    var detected$14 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.gol':
                                var $1486 = self.name;
                                var $1487 = self.dref;
                                var $1488 = self.verb;
                                return (() => {
                                    var expected$13 = Either$left("Function");
                                    var detected$14 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$13)(detected$14)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.hol':
                                var $1489 = self.path;
                                return (() => {
                                    var expected$11 = Either$left("Function");
                                    var detected$12 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.nat':
                                var $1490 = self.natx;
                                return (() => {
                                    var expected$11 = Either$left("Function");
                                    var detected$12 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.chr':
                                var $1491 = self.chrx;
                                return (() => {
                                    var expected$11 = Either$left("Function");
                                    var detected$12 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.str':
                                var $1492 = self.strx;
                                return (() => {
                                    var expected$11 = Either$left("Function");
                                    var detected$12 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$11)(detected$12)(ctx$4))(List$nil))
                                })();
                            case 'Fm.Term.cse':
                                var $1493 = self.path;
                                var $1494 = self.expr;
                                var $1495 = self.name;
                                var $1496 = self.with;
                                var $1497 = self.cses;
                                var $1498 = self.moti;
                                return (() => {
                                    var expected$16 = Either$left("Function");
                                    var detected$17 = Either$right(func_typ$9);
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(expected$16)(detected$17)(ctx$4))(List$nil))
                                })();
                        }
                    })()
                })()));
            case 'Fm.Term.let':
                var $1499 = self.name;
                var $1500 = self.expr;
                var $1501 = self.body;
                return (() => {
                    var ctx_size$9 = List$length(ctx$4);
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check($1500)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((expr_typ$10 => (() => {
                        var body_val$11 = $1501(Fm$Term$var($1499)(ctx_size$9));
                        var body_ctx$12 = List$cons(Pair$new($1499)(expr_typ$10))(ctx$4);
                        return Monad$bind(Fm$Check$monad)(Fm$Term$check(body_val$11)(type$2)(defs$3)(body_ctx$12)(Fm$MPath$1(path$5)))((body_typ$13 => Monad$pure(Fm$Check$monad)(body_typ$13)))
                    })()))
                })();
            case 'Fm.Term.def':
                var $1502 = self.name;
                var $1503 = self.expr;
                var $1504 = self.body;
                return Fm$Term$check($1504($1503))(type$2)(defs$3)(ctx$4)(path$5);
            case 'Fm.Term.ann':
                var $1505 = self.done;
                var $1506 = self.term;
                var $1507 = self.type;
                return (() => {
                    var self = $1505;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1507);
                        case 'false':
                            return Monad$bind(Fm$Check$monad)(Fm$Term$check($1506)(Maybe$some($1507))(defs$3)(ctx$4)(Fm$MPath$0(path$5)))(($9 => Monad$bind(Fm$Check$monad)(Fm$Term$check($1507)(Maybe$some(Fm$Term$typ))(defs$3)(ctx$4)(Fm$MPath$1(path$5)))(($10 => Monad$pure(Fm$Check$monad)($1507)))));
                    }
                })();
            case 'Fm.Term.gol':
                var $1508 = self.name;
                var $1509 = self.dref;
                var $1510 = self.verb;
                return Fm$Check$result(type$2)(List$cons(Fm$Error$show_goal($1508)($1509)($1510)(type$2)(ctx$4))(List$nil));
            case 'Fm.Term.hol':
                var $1511 = self.path;
                return Fm$Check$result(type$2)(List$nil);
            case 'Fm.Term.nat':
                var $1512 = self.natx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Nat"));
            case 'Fm.Term.chr':
                var $1513 = self.chrx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("Char"));
            case 'Fm.Term.str':
                var $1514 = self.strx;
                return Monad$pure(Fm$Check$monad)(Fm$Term$ref("String"));
            case 'Fm.Term.cse':
                var $1515 = self.path;
                var $1516 = self.expr;
                var $1517 = self.name;
                var $1518 = self.with;
                var $1519 = self.cses;
                var $1520 = self.moti;
                return (() => {
                    var expr$12 = $1516;
                    return Monad$bind(Fm$Check$monad)(Fm$Term$check(expr$12)(Maybe$none)(defs$3)(ctx$4)(Fm$MPath$0(path$5)))((etyp$13 => (() => {
                        var dsug$14 = Fm$Term$desugar_cse($1516)($1517)($1518)($1519)($1520)(etyp$13)(defs$3)(ctx$4);
                        return (() => {
                            var self = dsug$14;
                            switch (self._) {
                                case 'Maybe.none':
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$cant_infer(term$1)(ctx$4))(List$nil));
                                case 'Maybe.some':
                                    var $1521 = self.value;
                                    return Fm$Check$result(type$2)(List$cons(Fm$Error$patch(Fm$MPath$to_bits(path$5))($1521))(List$nil));
                            }
                        })()
                    })()))
                })();
        }
    })())((infr$6 => (() => {
        var self = type$2;
        switch (self._) {
            case 'Maybe.none':
                return Fm$Check$result(Maybe$some(infr$6))(List$nil);
            case 'Maybe.some':
                var $1522 = self.value;
                return Monad$bind(Fm$Check$monad)(Fm$Term$equal($1522)(infr$6)(defs$3)(List$length(ctx$4))(Set$new))((eqls$8 => (() => {
                    var self = eqls$8;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Monad$pure(Fm$Check$monad)($1522);
                        case 'false':
                            return Fm$Check$result(type$2)(List$cons(Fm$Error$type_mismatch(Either$right($1522))(Either$right(infr$6))(ctx$4))(List$nil));
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
                var $1523 = self.name;
                var $1524 = self.indx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1525 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1526 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.ref':
                var $1527 = self.name;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1528 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1529 = self.slice(0, -1);
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
                            var $1530 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1531 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.all':
                var $1532 = self.eras;
                var $1533 = self.self;
                var $1534 = self.name;
                var $1535 = self.xtyp;
                var $1536 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1537 = self.slice(0, -1);
                            return Fm$Term$all($1532)($1533)($1534)(Fm$Term$patch_at($1537)($1535)(fn$3))($1536);
                        case '1':
                            var $1538 = self.slice(0, -1);
                            return Fm$Term$all($1532)($1533)($1534)($1535)((s$10 => (x$11 => Fm$Term$patch_at($1538)($1536(s$10)(x$11))(fn$3))));
                    }
                })();
            case 'Fm.Term.lam':
                var $1539 = self.name;
                var $1540 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1541 = self.slice(0, -1);
                            return Fm$Term$lam($1539)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1540(x$7))(fn$3)));
                        case '1':
                            var $1542 = self.slice(0, -1);
                            return Fm$Term$lam($1539)((x$7 => Fm$Term$patch_at(Bits$tail(path$1))($1540(x$7))(fn$3)));
                    }
                })();
            case 'Fm.Term.app':
                var $1543 = self.func;
                var $1544 = self.argm;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1545 = self.slice(0, -1);
                            return Fm$Term$app(Fm$Term$patch_at($1545)($1543)(fn$3))($1544);
                        case '1':
                            var $1546 = self.slice(0, -1);
                            return Fm$Term$app($1543)(Fm$Term$patch_at($1546)($1544)(fn$3));
                    }
                })();
            case 'Fm.Term.let':
                var $1547 = self.name;
                var $1548 = self.expr;
                var $1549 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1550 = self.slice(0, -1);
                            return Fm$Term$let($1547)(Fm$Term$patch_at($1550)($1548)(fn$3))($1549);
                        case '1':
                            var $1551 = self.slice(0, -1);
                            return Fm$Term$let($1547)($1548)((x$8 => Fm$Term$patch_at($1551)($1549(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.def':
                var $1552 = self.name;
                var $1553 = self.expr;
                var $1554 = self.body;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1555 = self.slice(0, -1);
                            return Fm$Term$def($1552)(Fm$Term$patch_at($1555)($1553)(fn$3))($1554);
                        case '1':
                            var $1556 = self.slice(0, -1);
                            return Fm$Term$def($1552)($1553)((x$8 => Fm$Term$patch_at($1556)($1554(x$8))(fn$3)));
                    }
                })();
            case 'Fm.Term.ann':
                var $1557 = self.done;
                var $1558 = self.term;
                var $1559 = self.type;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1560 = self.slice(0, -1);
                            return Fm$Term$ann($1557)(Fm$Term$patch_at(path$1)($1558)(fn$3))($1559);
                        case '1':
                            var $1561 = self.slice(0, -1);
                            return Fm$Term$ann($1557)(Fm$Term$patch_at(path$1)($1558)(fn$3))($1559);
                    }
                })();
            case 'Fm.Term.gol':
                var $1562 = self.name;
                var $1563 = self.dref;
                var $1564 = self.verb;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1565 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1566 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.hol':
                var $1567 = self.path;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1568 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1569 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.nat':
                var $1570 = self.natx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1571 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1572 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.chr':
                var $1573 = self.chrx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1574 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1575 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.str':
                var $1576 = self.strx;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1577 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1578 = self.slice(0, -1);
                            return term$2;
                    }
                })();
            case 'Fm.Term.cse':
                var $1579 = self.path;
                var $1580 = self.expr;
                var $1581 = self.name;
                var $1582 = self.with;
                var $1583 = self.cses;
                var $1584 = self.moti;
                return (() => {
                    var self = path$1;
                    switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                        case 'nil':
                            return fn$3(term$2);
                        case '0':
                            var $1585 = self.slice(0, -1);
                            return term$2;
                        case '1':
                            var $1586 = self.slice(0, -1);
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
                        var $1587 = self.head;
                        var $1588 = self.tail;
                        return (() => {
                            var self = $1587;
                            switch (self._) {
                                case 'Fm.Error.type_mismatch':
                                    var $1589 = self.expected;
                                    var $1590 = self.detected;
                                    var $1591 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1588)(fixs$5);
                                case 'Fm.Error.show_goal':
                                    var $1592 = self.name;
                                    var $1593 = self.dref;
                                    var $1594 = self.verb;
                                    var $1595 = self.goal;
                                    var $1596 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1588)(fixs$5);
                                case 'Fm.Error.patch':
                                    var $1597 = self.path;
                                    var $1598 = self.term;
                                    return (() => {
                                        var self = $1597;
                                        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
                                            case 'nil':
                                                return Maybe$none;
                                            case '0':
                                                var $1599 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_term$11 = Fm$Term$patch_at($1599)(term$1)((x$11 => $1598));
                                                    return Fm$synth$fix(patched_term$11)(type$2)(defs$3)($1588)(Bool$true)
                                                })();
                                            case '1':
                                                var $1600 = self.slice(0, -1);
                                                return (() => {
                                                    var patched_type$11 = Fm$Term$patch_at($1600)(type$2)((x$11 => $1598));
                                                    return Fm$synth$fix(term$1)(patched_type$11)(defs$3)($1588)(Bool$true)
                                                })();
                                        }
                                    })();
                                case 'Fm.Error.undefined_reference':
                                    var $1601 = self.name;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1588)(fixs$5);
                                case 'Fm.Error.cant_infer':
                                    var $1602 = self.term;
                                    var $1603 = self.context;
                                    return Fm$synth$fix(term$1)(type$2)(defs$3)($1588)(fixs$5);
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
                    var $1604 = self.value;
                    var $1605 = self.errors;
                    return (() => {
                        var self = $1605;
                        switch (self._) {
                            case 'List.nil':
                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                            case 'List.cons':
                                var $1606 = self.head;
                                var $1607 = self.tail;
                                return (() => {
                                    var fixed$11 = Fm$synth$fix(term$2)(type$3)(defs$4)($1605)(Bool$false);
                                    return (() => {
                                        var self = fixed$11;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                return Fm$Def$new(name$1)(term$2)(type$3)(Bool$true);
                                            case 'Maybe.some':
                                                var $1608 = self.value;
                                                return (() => {
                                                    var self = $1608;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $1609 = self.fst;
                                                            var $1610 = self.snd;
                                                            return (() => {
                                                                var term$15 = Fm$Term$bind(List$nil)(Fm$Path$0(Fm$Path$nil))($1609);
                                                                var type$16 = Fm$Term$bind(List$nil)(Fm$Path$1(Fm$Path$nil))($1610);
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
                    var $1611 = self.fst;
                    var $1612 = self.snd;
                    return (() => {
                        var self = $1612;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $1613 = self.name;
                                var $1614 = self.term;
                                var $1615 = self.type;
                                var $1616 = self.done;
                                return (() => {
                                    var name$10 = Fm$Name$from_bits($1611);
                                    var term$11 = $1614;
                                    var type$12 = $1615;
                                    var done$13 = $1616;
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
    var Maybe$bind = (m$3 => (f$4 => (() => {
        var self = m$3;
        switch (self._) {
            case 'Maybe.none':
                return Maybe$none;
            case 'Maybe.some':
                var $1617 = self.value;
                return f$4($1617);
        }
    })()));
    var Maybe$monad = Monad$new(Maybe$bind)(Maybe$some);
    var Fm$Term$show$as_nat$go = (term$1 => (() => {
        var self = term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1618 = self.name;
                var $1619 = self.indx;
                return Maybe$none;
            case 'Fm.Term.ref':
                var $1620 = self.name;
                return (() => {
                    var self = ($1620 === "Nat.zero");
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return Maybe$some(0n);
                        case 'false':
                            return Maybe$none;
                    }
                })();
            case 'Fm.Term.typ':
                return Maybe$none;
            case 'Fm.Term.all':
                var $1621 = self.eras;
                var $1622 = self.self;
                var $1623 = self.name;
                var $1624 = self.xtyp;
                var $1625 = self.body;
                return Maybe$none;
            case 'Fm.Term.lam':
                var $1626 = self.name;
                var $1627 = self.body;
                return Maybe$none;
            case 'Fm.Term.app':
                var $1628 = self.func;
                var $1629 = self.argm;
                return (() => {
                    var self = $1628;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $1630 = self.name;
                            var $1631 = self.indx;
                            return Maybe$none;
                        case 'Fm.Term.ref':
                            var $1632 = self.name;
                            return (() => {
                                var self = ($1632 === "Nat.succ");
                                switch (self ? 'true' : 'false') {
                                    case 'true':
                                        return Monad$bind(Maybe$monad)(Fm$Term$show$as_nat$go($1629))((pred$5 => Monad$pure(Maybe$monad)(Nat$succ(pred$5))));
                                    case 'false':
                                        return Maybe$none;
                                }
                            })();
                        case 'Fm.Term.typ':
                            return Maybe$none;
                        case 'Fm.Term.all':
                            var $1633 = self.eras;
                            var $1634 = self.self;
                            var $1635 = self.name;
                            var $1636 = self.xtyp;
                            var $1637 = self.body;
                            return Maybe$none;
                        case 'Fm.Term.lam':
                            var $1638 = self.name;
                            var $1639 = self.body;
                            return Maybe$none;
                        case 'Fm.Term.app':
                            var $1640 = self.func;
                            var $1641 = self.argm;
                            return Maybe$none;
                        case 'Fm.Term.let':
                            var $1642 = self.name;
                            var $1643 = self.expr;
                            var $1644 = self.body;
                            return Maybe$none;
                        case 'Fm.Term.def':
                            var $1645 = self.name;
                            var $1646 = self.expr;
                            var $1647 = self.body;
                            return Maybe$none;
                        case 'Fm.Term.ann':
                            var $1648 = self.done;
                            var $1649 = self.term;
                            var $1650 = self.type;
                            return Maybe$none;
                        case 'Fm.Term.gol':
                            var $1651 = self.name;
                            var $1652 = self.dref;
                            var $1653 = self.verb;
                            return Maybe$none;
                        case 'Fm.Term.hol':
                            var $1654 = self.path;
                            return Maybe$none;
                        case 'Fm.Term.nat':
                            var $1655 = self.natx;
                            return Maybe$none;
                        case 'Fm.Term.chr':
                            var $1656 = self.chrx;
                            return Maybe$none;
                        case 'Fm.Term.str':
                            var $1657 = self.strx;
                            return Maybe$none;
                        case 'Fm.Term.cse':
                            var $1658 = self.path;
                            var $1659 = self.expr;
                            var $1660 = self.name;
                            var $1661 = self.with;
                            var $1662 = self.cses;
                            var $1663 = self.moti;
                            return Maybe$none;
                    }
                })();
            case 'Fm.Term.let':
                var $1664 = self.name;
                var $1665 = self.expr;
                var $1666 = self.body;
                return Maybe$none;
            case 'Fm.Term.def':
                var $1667 = self.name;
                var $1668 = self.expr;
                var $1669 = self.body;
                return Maybe$none;
            case 'Fm.Term.ann':
                var $1670 = self.done;
                var $1671 = self.term;
                var $1672 = self.type;
                return Maybe$none;
            case 'Fm.Term.gol':
                var $1673 = self.name;
                var $1674 = self.dref;
                var $1675 = self.verb;
                return Maybe$none;
            case 'Fm.Term.hol':
                var $1676 = self.path;
                return Maybe$none;
            case 'Fm.Term.nat':
                var $1677 = self.natx;
                return Maybe$none;
            case 'Fm.Term.chr':
                var $1678 = self.chrx;
                return Maybe$none;
            case 'Fm.Term.str':
                var $1679 = self.strx;
                return Maybe$none;
            case 'Fm.Term.cse':
                var $1680 = self.path;
                var $1681 = self.expr;
                var $1682 = self.name;
                var $1683 = self.with;
                var $1684 = self.cses;
                var $1685 = self.moti;
                return Maybe$none;
        }
    })());
    var Fm$Term$show$as_nat = (term$1 => Maybe$mapped(Fm$Term$show$as_nat$go(term$1))(Nat$show));
    var Bits$to_nat = (b$1 => (() => {
        var self = b$1;
        switch (self.length === 0 ? 'nil' : self[self.length - 1] === '0' ? '0' : '1') {
            case 'nil':
                return 0n;
            case '0':
                var $1686 = self.slice(0, -1);
                return (2n * Bits$to_nat($1686));
            case '1':
                var $1687 = self.slice(0, -1);
                return Nat$succ((2n * Bits$to_nat($1687)));
        }
    })());
    var Fm$escape = (str$1 => (() => {
        var self = str$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return "";
            case 'cons':
                var $1688 = self.charCodeAt(0);
                var $1689 = self.slice(1);
                return (() => {
                    var head$4 = $1688;
                    var tail$5 = Fm$escape($1689);
                    return List$fold(Fm$escapes)(String$cons(head$4)(tail$5))((esc$6 => (cont$7 => (() => {
                        var self = esc$6;
                        switch (self._) {
                            case 'Pair.new':
                                var $1690 = self.fst;
                                var $1691 = self.snd;
                                return (() => {
                                    var self = (head$4 === $1691);
                                    switch (self ? 'true' : 'false') {
                                        case 'true':
                                            return ($1690 + tail$5);
                                        case 'false':
                                            return cont$7;
                                    }
                                })();
                        }
                    })())))
                })();
        }
    })());
    var String$join$go = (sep$1 => (list$2 => (fst$3 => (() => {
        var self = list$2;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1692 = self.head;
                var $1693 = self.tail;
                return String$flatten(List$cons((() => {
                    var self = fst$3;
                    switch (self ? 'true' : 'false') {
                        case 'true':
                            return "";
                        case 'false':
                            return sep$1;
                    }
                })())(List$cons($1692)(List$cons(String$join$go(sep$1)($1693)(Bool$false))(List$nil))));
        }
    })())));
    var String$join = (sep$1 => (list$2 => String$join$go(sep$1)(list$2)(Bool$true)));
    var Pair$fst = (pair$3 => (() => {
        var self = pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1694 = self.fst;
                var $1695 = self.snd;
                return $1694;
        }
    })());
    var Fm$Term$show$go = (term$1 => (path$2 => (() => {
        var self = Fm$Term$show$as_nat(term$1);
        switch (self._) {
            case 'Maybe.none':
                return (() => {
                    var self = term$1;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $1696 = self.name;
                            var $1697 = self.indx;
                            return Fm$Name$show($1696);
                        case 'Fm.Term.ref':
                            var $1698 = self.name;
                            return (() => {
                                var name$4 = Fm$Name$show($1698);
                                return (() => {
                                    var self = path$2;
                                    switch (self._) {
                                        case 'Maybe.none':
                                            return name$4;
                                        case 'Maybe.some':
                                            var $1699 = self.value;
                                            return (() => {
                                                var path_val$6 = (Bits$1(Bits$nil) + Fm$Path$to_bits($1699));
                                                var path_str$7 = Nat$show(Bits$to_nat(path_val$6));
                                                return String$flatten(List$cons(name$4)(List$cons("\u{1b}[2m-")(List$cons(path_str$7)(List$cons("\u{1b}[0m")(List$nil)))))
                                            })();
                                    }
                                })()
                            })();
                        case 'Fm.Term.typ':
                            return "Type";
                        case 'Fm.Term.all':
                            var $1700 = self.eras;
                            var $1701 = self.self;
                            var $1702 = self.name;
                            var $1703 = self.xtyp;
                            var $1704 = self.body;
                            return (() => {
                                var eras$8 = $1700;
                                var self$9 = Fm$Name$show($1701);
                                var name$10 = Fm$Name$show($1702);
                                var type$11 = Fm$Term$show$go($1703)(Fm$MPath$0(path$2));
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
                                var body$14 = Fm$Term$show$go($1704(Fm$Term$var($1701)(0n))(Fm$Term$var($1702)(0n)))(Fm$MPath$1(path$2));
                                return String$flatten(List$cons(self$9)(List$cons(open$12)(List$cons(name$10)(List$cons(":")(List$cons(type$11)(List$cons(clos$13)(List$cons(" ")(List$cons(body$14)(List$nil)))))))))
                            })();
                        case 'Fm.Term.lam':
                            var $1705 = self.name;
                            var $1706 = self.body;
                            return (() => {
                                var name$5 = Fm$Name$show($1705);
                                var body$6 = Fm$Term$show$go($1706(Fm$Term$var($1705)(0n)))(Fm$MPath$0(path$2));
                                return String$flatten(List$cons("(")(List$cons(name$5)(List$cons(") ")(List$cons(body$6)(List$nil)))))
                            })();
                        case 'Fm.Term.app':
                            var $1707 = self.func;
                            var $1708 = self.argm;
                            return (() => {
                                var func$5 = Fm$Term$show$go($1707)(Fm$MPath$0(path$2));
                                var argm$6 = Fm$Term$show$go($1708)(Fm$MPath$1(path$2));
                                var wrap$7 = (() => {
                                    var self = func$5;
                                    switch (self.length === 0 ? 'nil' : 'cons') {
                                        case 'nil':
                                            return Bool$false;
                                        case 'cons':
                                            var $1709 = self.charCodeAt(0);
                                            var $1710 = self.slice(1);
                                            return ($1709 === 40);
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
                            var $1711 = self.name;
                            var $1712 = self.expr;
                            var $1713 = self.body;
                            return (() => {
                                var name$6 = Fm$Name$show($1711);
                                var expr$7 = Fm$Term$show$go($1712)(Fm$MPath$0(path$2));
                                var body$8 = Fm$Term$show$go($1713(Fm$Term$var($1711)(0n)))(Fm$MPath$1(path$2));
                                return String$flatten(List$cons("let ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                            })();
                        case 'Fm.Term.def':
                            var $1714 = self.name;
                            var $1715 = self.expr;
                            var $1716 = self.body;
                            return (() => {
                                var name$6 = Fm$Name$show($1714);
                                var expr$7 = Fm$Term$show$go($1715)(Fm$MPath$0(path$2));
                                var body$8 = Fm$Term$show$go($1716(Fm$Term$var($1714)(0n)))(Fm$MPath$1(path$2));
                                return String$flatten(List$cons("def ")(List$cons(name$6)(List$cons(" = ")(List$cons(expr$7)(List$cons("; ")(List$cons(body$8)(List$nil)))))))
                            })();
                        case 'Fm.Term.ann':
                            var $1717 = self.done;
                            var $1718 = self.term;
                            var $1719 = self.type;
                            return (() => {
                                var term$6 = Fm$Term$show$go($1718)(Fm$MPath$0(path$2));
                                var type$7 = Fm$Term$show$go($1719)(Fm$MPath$1(path$2));
                                return String$flatten(List$cons(term$6)(List$cons("::")(List$cons(type$7)(List$nil))))
                            })();
                        case 'Fm.Term.gol':
                            var $1720 = self.name;
                            var $1721 = self.dref;
                            var $1722 = self.verb;
                            return (() => {
                                var name$6 = Fm$Name$show($1720);
                                return String$flatten(List$cons("?")(List$cons(name$6)(List$nil)))
                            })();
                        case 'Fm.Term.hol':
                            var $1723 = self.path;
                            return "_";
                        case 'Fm.Term.nat':
                            var $1724 = self.natx;
                            return String$flatten(List$cons(Nat$show($1724))(List$nil));
                        case 'Fm.Term.chr':
                            var $1725 = self.chrx;
                            return String$cons($1725)(String$nil);
                        case 'Fm.Term.str':
                            var $1726 = self.strx;
                            return String$flatten(List$cons("\"")(List$cons(Fm$escape($1726))(List$cons("\"")(List$nil))));
                        case 'Fm.Term.cse':
                            var $1727 = self.path;
                            var $1728 = self.expr;
                            var $1729 = self.name;
                            var $1730 = self.with;
                            var $1731 = self.cses;
                            var $1732 = self.moti;
                            return (() => {
                                var expr$9 = Fm$Term$show$go($1728)(Fm$MPath$0(path$2));
                                var name$10 = Fm$Name$show($1729);
                                var with$11 = String$join("")(List$mapped($1730)((def$11 => (() => {
                                    var self = def$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1733 = self.name;
                                            var $1734 = self.term;
                                            var $1735 = self.type;
                                            var $1736 = self.done;
                                            return (() => {
                                                var name$16 = Fm$Name$show($1733);
                                                var type$17 = Fm$Term$show$go($1735)(Maybe$none);
                                                var term$18 = Fm$Term$show$go($1734)(Maybe$none);
                                                return String$flatten(List$cons(name$16)(List$cons(": ")(List$cons(type$17)(List$cons(" = ")(List$cons(term$18)(List$cons(";")(List$nil)))))))
                                            })();
                                    }
                                })())));
                                var cses$12 = Map$to_list($1731);
                                var cses$13 = String$join("")(List$mapped(cses$12)((x$13 => (() => {
                                    var name$14 = Fm$Name$from_bits(Pair$fst(x$13));
                                    var term$15 = Fm$Term$show$go(Pair$snd(x$13))(Maybe$none);
                                    return String$flatten(List$cons(name$14)(List$cons(": ")(List$cons(term$15)(List$cons("; ")(List$nil)))))
                                })())));
                                var moti$14 = Fm$Term$show$go($1732)(Maybe$none);
                                return String$flatten(List$cons("case ")(List$cons(expr$9)(List$cons(" as ")(List$cons(name$10)(List$cons(with$11)(List$cons(" { ")(List$cons(cses$13)(List$cons("} : ")(List$cons(moti$14)(List$nil))))))))))
                            })();
                    }
                })();
            case 'Maybe.some':
                var $1737 = self.value;
                return $1737;
        }
    })()));
    var Fm$Term$show = (term$1 => Fm$Term$show$go(term$1)(Maybe$none));
    var String$is_empty = (str$1 => (() => {
        var self = str$1;
        switch (self.length === 0 ? 'nil' : 'cons') {
            case 'nil':
                return Bool$true;
            case 'cons':
                var $1738 = self.charCodeAt(0);
                var $1739 = self.slice(1);
                return Bool$false;
        }
    })());
    var Fm$Context$show = (context$1 => (() => {
        var self = context$1;
        switch (self._) {
            case 'List.nil':
                return "";
            case 'List.cons':
                var $1740 = self.head;
                var $1741 = self.tail;
                return (() => {
                    var self = $1740;
                    switch (self._) {
                        case 'Pair.new':
                            var $1742 = self.fst;
                            var $1743 = self.snd;
                            return (() => {
                                var name$6 = Fm$Name$show($1742);
                                var type$7 = Fm$Term$show($1743);
                                var rest$8 = Fm$Context$show($1741);
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
                var $1744 = self.name;
                var $1745 = self.indx;
                return term$4;
            case 'Fm.Term.ref':
                var $1746 = self.name;
                return (() => {
                    var self = Fm$get($1746)(defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            return Fm$Term$ref($1746);
                        case 'Maybe.some':
                            var $1747 = self.value;
                            return (() => {
                                var self = $1747;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $1748 = self.name;
                                        var $1749 = self.term;
                                        var $1750 = self.type;
                                        var $1751 = self.done;
                                        return $1749;
                                }
                            })();
                    }
                })();
            case 'Fm.Term.typ':
                return term$4;
            case 'Fm.Term.all':
                var $1752 = self.eras;
                var $1753 = self.self;
                var $1754 = self.name;
                var $1755 = self.xtyp;
                var $1756 = self.body;
                return term$4;
            case 'Fm.Term.lam':
                var $1757 = self.name;
                var $1758 = self.body;
                return term$4;
            case 'Fm.Term.app':
                var $1759 = self.func;
                var $1760 = self.argm;
                return term$4;
            case 'Fm.Term.let':
                var $1761 = self.name;
                var $1762 = self.expr;
                var $1763 = self.body;
                return term$4;
            case 'Fm.Term.def':
                var $1764 = self.name;
                var $1765 = self.expr;
                var $1766 = self.body;
                return term$4;
            case 'Fm.Term.ann':
                var $1767 = self.done;
                var $1768 = self.term;
                var $1769 = self.type;
                return term$4;
            case 'Fm.Term.gol':
                var $1770 = self.name;
                var $1771 = self.dref;
                var $1772 = self.verb;
                return term$4;
            case 'Fm.Term.hol':
                var $1773 = self.path;
                return term$4;
            case 'Fm.Term.nat':
                var $1774 = self.natx;
                return term$4;
            case 'Fm.Term.chr':
                var $1775 = self.chrx;
                return term$4;
            case 'Fm.Term.str':
                var $1776 = self.strx;
                return term$4;
            case 'Fm.Term.cse':
                var $1777 = self.path;
                var $1778 = self.expr;
                var $1779 = self.name;
                var $1780 = self.with;
                var $1781 = self.cses;
                var $1782 = self.moti;
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
                var $1783 = self.expected;
                var $1784 = self.detected;
                var $1785 = self.context;
                return (() => {
                    var expected$6 = (() => {
                        var self = $1783;
                        switch (self._) {
                            case 'Either.left':
                                var $1786 = self.value;
                                return $1786;
                            case 'Either.right':
                                var $1787 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1787)(Map$new));
                        }
                    })();
                    var detected$7 = (() => {
                        var self = $1784;
                        switch (self._) {
                            case 'Either.left':
                                var $1788 = self.value;
                                return $1788;
                            case 'Either.right':
                                var $1789 = self.value;
                                return Fm$Term$show(Fm$Term$normalize($1789)(Map$new));
                        }
                    })();
                    var context$8 = Fm$Context$show($1785);
                    return String$flatten(List$cons("Type mismatch.\u{a}")(List$cons("- Expected: ")(List$cons(expected$6)(List$cons("\u{a}")(List$cons("- Detected: ")(List$cons(detected$7)(List$cons("\u{a}")(List$cons("With context:\u{a}")(List$cons(context$8)(List$nil))))))))))
                })();
            case 'Fm.Error.show_goal':
                var $1790 = self.name;
                var $1791 = self.dref;
                var $1792 = self.verb;
                var $1793 = self.goal;
                var $1794 = self.context;
                return (() => {
                    var goal_name$8 = String$flatten(List$cons("Goal ?")(List$cons(Fm$Name$show($1790))(List$cons(":\u{a}")(List$nil))));
                    var with_type$9 = (() => {
                        var self = $1793;
                        switch (self._) {
                            case 'Maybe.none':
                                return "";
                            case 'Maybe.some':
                                var $1795 = self.value;
                                return (() => {
                                    var goal$10 = Fm$Term$expand($1791)($1795)(defs$2);
                                    return String$flatten(List$cons("With type: ")(List$cons((() => {
                                        var self = $1792;
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
                    var with_ctxt$10 = String$flatten(List$cons("With ctxt:\u{a}")(List$cons(Fm$Context$show($1794))(List$nil)));
                    return String$flatten(List$cons(goal_name$8)(List$cons(with_type$9)(List$cons(with_ctxt$10)(List$nil))))
                })();
            case 'Fm.Error.patch':
                var $1796 = self.path;
                var $1797 = self.term;
                return String$flatten(List$cons("Patching: ")(List$cons(Fm$Term$show($1797))(List$nil)));
            case 'Fm.Error.undefined_reference':
                var $1798 = self.name;
                return String$flatten(List$cons("Undefined reference: ")(List$cons(Fm$Name$show($1798))(List$nil)));
            case 'Fm.Error.cant_infer':
                var $1799 = self.term;
                var $1800 = self.context;
                return (() => {
                    var term$5 = Fm$Term$show($1799);
                    var context$6 = Fm$Context$show($1800);
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
                    var $1801 = self.fst;
                    var $1802 = self.snd;
                    return (() => {
                        var self = def$3;
                        switch (self._) {
                            case 'Pair.new':
                                var $1803 = self.fst;
                                var $1804 = self.snd;
                                return (() => {
                                    var self = $1804;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $1805 = self.name;
                                            var $1806 = self.term;
                                            var $1807 = self.type;
                                            var $1808 = self.done;
                                            return (() => {
                                                var name$13 = Fm$Name$from_bits($1803);
                                                var term$14 = $1806;
                                                var type$15 = $1807;
                                                var check$16 = Fm$Term$check(term$14)(Maybe$some(type$15))(defs$1)(List$nil)(Fm$MPath$nil);
                                                return (() => {
                                                    var self = check$16;
                                                    switch (self._) {
                                                        case 'Fm.Check.result':
                                                            var $1809 = self.value;
                                                            var $1810 = self.errors;
                                                            return (() => {
                                                                var self = $1810;
                                                                switch (self._) {
                                                                    case 'List.nil':
                                                                        return (() => {
                                                                            var name_str$19 = Fm$Name$show(name$13);
                                                                            var type_str$20 = Fm$Term$show(type$15);
                                                                            var term_str$21 = Fm$Term$show(term$14);
                                                                            var string_0$22 = String$flatten(List$cons($1801)(List$cons(name_str$19)(List$cons(": ")(List$cons(type_str$20)(List$cons("\u{a}  ")(List$cons(term_str$21)(List$cons("\u{a}\u{a}")(List$nil))))))));
                                                                            var string_1$23 = $1802;
                                                                            return Pair$new(string_0$22)(string_1$23)
                                                                        })();
                                                                    case 'List.cons':
                                                                        var $1811 = self.head;
                                                                        var $1812 = self.tail;
                                                                        return (() => {
                                                                            var name_str$21 = Fm$Name$show(name$13);
                                                                            var type_str$22 = "<error>";
                                                                            var string_0$23 = String$flatten(List$cons($1801)(List$cons(name_str$21)(List$cons(": ")(List$cons(type_str$22)(List$cons("\u{a}")(List$nil))))));
                                                                            var string_1$24 = $1802;
                                                                            var string_1$25 = (list_for($1810)(string_1$24)((error$25 => (string_1$26 => String$flatten(List$cons(string_1$26)(List$cons("On ")(List$cons(name_str$21)(List$cons(":\u{a}")(List$cons(Fm$Error$show(error$25)(defs$1))(List$cons("\u{a}")(List$nil)))))))))));
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
                    var $1813 = self.fst;
                    var $1814 = self.snd;
                    return String$flatten(List$cons("\u{a}# Types:\u{a}\u{a}")(List$cons($1813)(List$cons("\u{a}")(List$cons((() => {
                        var self = $1814;
                        switch (self.length === 0 ? 'nil' : 'cons') {
                            case 'nil':
                                return "";
                            case 'cons':
                                var $1815 = self.charCodeAt(0);
                                var $1816 = self.slice(1);
                                return String$flatten(List$cons("# Errors:\u{a}\u{a}")(List$cons($1814)(List$nil)));
                        }
                    })())(List$nil)))));
            }
        })()
    })());
    var IO$print = (text$1 => IO$ask("print")(text$1)((skip$2 => IO$end(Unit$new))));
    var main = (() => {
        var sstr$1 = Fm$Term$serialize$string;
        return Monad$bind(IO$monad)(IO$get_args)((name$2 => (() => {
            var name$3 = (() => {
                var self = name$2;
                switch (self.length === 0 ? 'nil' : 'cons') {
                    case 'nil':
                        return "main.fm";
                    case 'cons':
                        var $1817 = self.charCodeAt(0);
                        var $1818 = self.slice(1);
                        return name$2;
                }
            })();
            var name$4 = "main.fm";
            return Monad$bind(IO$monad)(IO$get_file(name$4))((file$5 => (() => {
                var defs$6 = Maybe$default(Map$new)(Fm$Defs$read(file$5));
                var defs$7 = Fm$synth(defs$6);
                var report$8 = Fm$report(defs$7);
                return IO$print(report$8)
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
        'Cmp.as_eql': Cmp$as_eql,
        'Word.cmp.go': Word$cmp$go,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
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
        'Fm.escapes': Fm$escapes,
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
        'Fm.Term.cse': Fm$Term$cse,
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
        'Fm.Error.show_goal': Fm$Error$show_goal,
        'Fm.Term.desugar_cse.motive': Fm$Term$desugar_cse$motive,
        'Fm.Term.desugar_cse.argument': Fm$Term$desugar_cse$argument,
        'Maybe.or': Maybe$or,
        'Fm.Term.desugar_cse.cases': Fm$Term$desugar_cse$cases,
        'Fm.Term.desugar_cse': Fm$Term$desugar_cse,
        'Fm.Error.patch': Fm$Error$patch,
        'Fm.MPath.to_bits': Fm$MPath$to_bits,
        'U16.to_word': U16$to_word,
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
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Fm.Term.show.as_nat.go': Fm$Term$show$as_nat$go,
        'Fm.Term.show.as_nat': Fm$Term$show$as_nat,
        'Bits.to_nat': Bits$to_nat,
        'Fm.escape': Fm$escape,
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
