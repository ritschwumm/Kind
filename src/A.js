module.exports = (function() {
    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };
    const inst_unit = x => x(1);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $9 = c0;
                    return $9;
                case 'o':
                    var $10 = self.slice(0, -1);
                    var $11 = c1($10);
                    return $11;
                case 'i':
                    var $12 = self.slice(0, -1);
                    var $13 = c2($12);
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $15 = u16_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $22 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $18 = c2;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c2($19)($20);
                return $21;
            };
        })();
        return $22;
    });
    const Unit$new = 1;
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Pair$(_A$1, _B$2) {
        var $23 = null;
        return $23;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $24 = (String.fromCharCode(_head$1) + _tail$2);
        return $24;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const String$nil = '';

    function Pair$new$(_fst$3, _snd$4) {
        var $25 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $25;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const Bool$true = true;
    const Bool$or = a0 => a1 => (a0 || a1);
    const Bool$false = false;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $27 = Bool$false;
                var $26 = $27;
                break;
            case 'Cmp.eql':
                var $28 = Bool$true;
                var $26 = $28;
                break;
            case 'Cmp.gtn':
                var $29 = Bool$false;
                var $26 = $29;
                break;
        };
        return $26;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $31 = (_b$5 => {
                    var $32 = _c$4;
                    return $32;
                });
                var $30 = $31;
                break;
            case 'Word.o':
                var $33 = self.pred;
                var $34 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $36 = (_a$pred$8 => {
                                var $37 = _c$4;
                                return $37;
                            });
                            var $35 = $36;
                            break;
                        case 'Word.o':
                            var $38 = self.pred;
                            var $39 = (_a$pred$10 => {
                                var $40 = Word$cmp$go$(_a$pred$10, $38, _c$4);
                                return $40;
                            });
                            var $35 = $39;
                            break;
                        case 'Word.i':
                            var $41 = self.pred;
                            var $42 = (_a$pred$10 => {
                                var $43 = Word$cmp$go$(_a$pred$10, $41, Cmp$ltn);
                                return $43;
                            });
                            var $35 = $42;
                            break;
                    };
                    var $35 = $35($33);
                    return $35;
                });
                var $30 = $34;
                break;
            case 'Word.i':
                var $44 = self.pred;
                var $45 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $47 = (_a$pred$8 => {
                                var $48 = _c$4;
                                return $48;
                            });
                            var $46 = $47;
                            break;
                        case 'Word.o':
                            var $49 = self.pred;
                            var $50 = (_a$pred$10 => {
                                var $51 = Word$cmp$go$(_a$pred$10, $49, Cmp$gtn);
                                return $51;
                            });
                            var $46 = $50;
                            break;
                        case 'Word.i':
                            var $52 = self.pred;
                            var $53 = (_a$pred$10 => {
                                var $54 = Word$cmp$go$(_a$pred$10, $52, _c$4);
                                return $54;
                            });
                            var $46 = $53;
                            break;
                    };
                    var $46 = $46($44);
                    return $46;
                });
                var $30 = $45;
                break;
        };
        var $30 = $30(_b$3);
        return $30;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $55 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $55;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $56 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $56;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $57 = 1n + _pred$1;
        return $57;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$eql = a0 => a1 => (a0 === a1);

    function Fm$Core$read$spaces$(_code$1) {
        var Fm$Core$read$spaces$ = (_code$1) => ({
            ctr: 'TCO',
            arg: [_code$1]
        });
        var Fm$Core$read$spaces = _code$1 => Fm$Core$read$spaces$(_code$1);
        var arg = [_code$1];
        while (true) {
            let [_code$1] = arg;
            var R = (() => {
                var self = _code$1;
                if (self.length === 0) {
                    var $58 = Pair$new$(_code$1, Unit$new);
                    return $58;
                } else {
                    var $59 = self.charCodeAt(0);
                    var $60 = self.slice(1);
                    var _is_space$4 = (($59 === 32) || (($59 === 10) || (($59 === 13) || (($59 === 9) || (($59 === 11) || (($59 === 12) || Bool$false))))));
                    var self = _is_space$4;
                    if (self) {
                        var $62 = Fm$Core$read$spaces$($60);
                        var $61 = $62;
                    } else {
                        var $63 = Pair$new$(_code$1, Unit$new);
                        var $61 = $63;
                    };
                    return $61;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Core$read$spaces = x0 => Fm$Core$read$spaces$(x0);

    function Fm$Term$ref$(_name$1) {
        var $64 = ({
            _: 'Fm.Term.ref',
            'name': _name$1
        });
        return $64;
    };
    const Fm$Term$ref = x0 => Fm$Term$ref$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $65 = (_a$1 === _b$2);
        return $65;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);
    const Fm$Term$typ = ({
        _: 'Fm.Term.typ'
    });
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $67 = Bool$false;
                var $66 = $67;
                break;
            case 'Cmp.eql':
                var $68 = Bool$true;
                var $66 = $68;
                break;
            case 'Cmp.gtn':
                var $69 = Bool$true;
                var $66 = $69;
                break;
        };
        return $66;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $70 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $70;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $71 = _x$4;
                    return $71;
                } else {
                    var $72 = (self - 1n);
                    var $73 = Nat$apply$($72, _f$3, _f$3(_x$4));
                    return $73;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $74 = word_to_u16(_value$1);
        return $74;
    };
    const U16$new = x0 => U16$new$(x0);

    function Word$(_size$1) {
        var $75 = null;
        return $75;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $76 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $76;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $77 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $77;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.e':
                var $79 = Word$e;
                var $78 = $79;
                break;
            case 'Word.o':
                var $80 = self.pred;
                var $81 = Word$i$($80);
                var $78 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = Word$o$(Word$inc$($82));
                var $78 = $83;
                break;
        };
        return $78;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U16$inc$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $85 = u16_to_word(self);
                var $86 = U16$new$(Word$inc$($85));
                var $84 = $86;
                break;
        };
        return $84;
    };
    const U16$inc = x0 => U16$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $88 = Word$e;
            var $87 = $88;
        } else {
            var $89 = (self - 1n);
            var $90 = Word$o$(Word$zero$($89));
            var $87 = $90;
        };
        return $87;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U16$zero = U16$new$(Word$zero$(16n));
    const Nat$to_u16 = a0 => (Number(a0));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $92 = Bool$true;
                var $91 = $92;
                break;
            case 'Cmp.eql':
                var $93 = Bool$true;
                var $91 = $93;
                break;
            case 'Cmp.gtn':
                var $94 = Bool$false;
                var $91 = $94;
                break;
        };
        return $91;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $95 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $95;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $97 = Bool$true;
                var $96 = $97;
                break;
            case 'Cmp.eql':
                var $98 = Bool$false;
                var $96 = $98;
                break;
            case 'Cmp.gtn':
                var $99 = Bool$false;
                var $96 = $99;
                break;
        };
        return $96;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$ltn$(_a$2, _b$3) {
        var $100 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $100;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function Fm$Core$read$is_name$(_chr$1) {
        var $101 = (((_chr$1 >= 46) && (_chr$1 <= 47)) || (((_chr$1 >= 48) && (_chr$1 < 58)) || (((_chr$1 >= 65) && (_chr$1 < 91)) || (((_chr$1 >= 95) && (_chr$1 < 96)) || (((_chr$1 >= 97) && (_chr$1 < 123)) || Bool$false)))));
        return $101;
    };
    const Fm$Core$read$is_name = x0 => Fm$Core$read$is_name$(x0);

    function Fm$Core$read$name$(_code$1) {
        var self = _code$1;
        if (self.length === 0) {
            var $103 = Pair$new$(_code$1, "");
            var $102 = $103;
        } else {
            var $104 = self.charCodeAt(0);
            var $105 = self.slice(1);
            var self = Fm$Core$read$is_name$($104);
            if (self) {
                var self = Fm$Core$read$name$($105);
                switch (self._) {
                    case 'Pair.new':
                        var $108 = self.fst;
                        var $109 = self.snd;
                        var $110 = Pair$new$($108, String$cons$($104, $109));
                        var $107 = $110;
                        break;
                };
                var $106 = $107;
            } else {
                var $111 = Pair$new$(_code$1, "");
                var $106 = $111;
            };
            var $102 = $106;
        };
        return $102;
    };
    const Fm$Core$read$name = x0 => Fm$Core$read$name$(x0);

    function Fm$Core$read$char$(_code$1, _chr$2) {
        var self = Fm$Core$read$spaces$(_code$1);
        switch (self._) {
            case 'Pair.new':
                var $113 = self.fst;
                var $114 = self.snd;
                var self = $113;
                if (self.length === 0) {
                    var $116 = Pair$new$("", Unit$new);
                    var $115 = $116;
                } else {
                    var $117 = self.charCodeAt(0);
                    var $118 = self.slice(1);
                    var self = ($117 === _chr$2);
                    if (self) {
                        var $120 = Pair$new$($118, Unit$new);
                        var $119 = $120;
                    } else {
                        var $121 = Pair$new$("", Unit$new);
                        var $119 = $121;
                    };
                    var $115 = $119;
                };
                var $112 = $115;
                break;
        };
        return $112;
    };
    const Fm$Core$read$char = x0 => x1 => Fm$Core$read$char$(x0, x1);

    function Fm$Term$all$(_eras$1, _self$2, _name$3, _xtyp$4, _body$5) {
        var $122 = ({
            _: 'Fm.Term.all',
            'eras': _eras$1,
            'self': _self$2,
            'name': _name$3,
            'xtyp': _xtyp$4,
            'body': _body$5
        });
        return $122;
    };
    const Fm$Term$all = x0 => x1 => x2 => x3 => x4 => Fm$Term$all$(x0, x1, x2, x3, x4);

    function List$cons$(_head$2, _tail$3) {
        var $123 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $123;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Fm$Term$lam$(_name$1, _body$2) {
        var $124 = ({
            _: 'Fm.Term.lam',
            'name': _name$1,
            'body': _body$2
        });
        return $124;
    };
    const Fm$Term$lam = x0 => x1 => Fm$Term$lam$(x0, x1);

    function Fm$Term$app$(_func$1, _argm$2) {
        var $125 = ({
            _: 'Fm.Term.app',
            'func': _func$1,
            'argm': _argm$2
        });
        return $125;
    };
    const Fm$Term$app = x0 => x1 => Fm$Term$app$(x0, x1);

    function Fm$Term$let$(_name$1, _expr$2, _body$3) {
        var $126 = ({
            _: 'Fm.Term.let',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $126;
    };
    const Fm$Term$let = x0 => x1 => x2 => Fm$Term$let$(x0, x1, x2);

    function Fm$Term$def$(_name$1, _expr$2, _body$3) {
        var $127 = ({
            _: 'Fm.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $127;
    };
    const Fm$Term$def = x0 => x1 => x2 => Fm$Term$def$(x0, x1, x2);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $128 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $128;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $129 = Bool$true;
                    return $129;
                } else {
                    var $130 = self.charCodeAt(0);
                    var $131 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $133 = Bool$false;
                        var $132 = $133;
                    } else {
                        var $134 = self.charCodeAt(0);
                        var $135 = self.slice(1);
                        var self = Char$eql$($130, $134);
                        if (self) {
                            var $137 = String$starts_with$($135, $131);
                            var $136 = $137;
                        } else {
                            var $138 = Bool$false;
                            var $136 = $138;
                        };
                        var $132 = $136;
                    };
                    return $132;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $139 = _xs$2;
                    return $139;
                } else {
                    var $140 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $142 = String$nil;
                        var $141 = $142;
                    } else {
                        var $143 = self.charCodeAt(0);
                        var $144 = self.slice(1);
                        var $145 = String$drop$($140, $144);
                        var $141 = $145;
                    };
                    return $141;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function Char$is_hex$(_chr$1) {
        var $146 = (((_chr$1 >= 48) && (_chr$1 <= 57)) || (((_chr$1 >= 97) && (_chr$1 <= 102)) || (((_chr$1 >= 65) && (_chr$1 <= 70)) || Bool$false)));
        return $146;
    };
    const Char$is_hex = x0 => Char$is_hex$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $148 = (_b$5 => {
                    var $149 = Word$e;
                    return $149;
                });
                var $147 = $148;
                break;
            case 'Word.o':
                var $150 = self.pred;
                var $151 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $153 = (_a$pred$8 => {
                                var $154 = Word$e;
                                return $154;
                            });
                            var $152 = $153;
                            break;
                        case 'Word.o':
                            var $155 = self.pred;
                            var $156 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $158 = Word$i$(Word$adder$(_a$pred$10, $155, Bool$false));
                                    var $157 = $158;
                                } else {
                                    var $159 = Word$o$(Word$adder$(_a$pred$10, $155, Bool$false));
                                    var $157 = $159;
                                };
                                return $157;
                            });
                            var $152 = $156;
                            break;
                        case 'Word.i':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $163 = Word$o$(Word$adder$(_a$pred$10, $160, Bool$true));
                                    var $162 = $163;
                                } else {
                                    var $164 = Word$i$(Word$adder$(_a$pred$10, $160, Bool$false));
                                    var $162 = $164;
                                };
                                return $162;
                            });
                            var $152 = $161;
                            break;
                    };
                    var $152 = $152($150);
                    return $152;
                });
                var $147 = $151;
                break;
            case 'Word.i':
                var $165 = self.pred;
                var $166 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $168 = (_a$pred$8 => {
                                var $169 = Word$e;
                                return $169;
                            });
                            var $167 = $168;
                            break;
                        case 'Word.o':
                            var $170 = self.pred;
                            var $171 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $173 = Word$o$(Word$adder$(_a$pred$10, $170, Bool$true));
                                    var $172 = $173;
                                } else {
                                    var $174 = Word$i$(Word$adder$(_a$pred$10, $170, Bool$false));
                                    var $172 = $174;
                                };
                                return $172;
                            });
                            var $167 = $171;
                            break;
                        case 'Word.i':
                            var $175 = self.pred;
                            var $176 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $178 = Word$i$(Word$adder$(_a$pred$10, $175, Bool$true));
                                    var $177 = $178;
                                } else {
                                    var $179 = Word$o$(Word$adder$(_a$pred$10, $175, Bool$true));
                                    var $177 = $179;
                                };
                                return $177;
                            });
                            var $167 = $176;
                            break;
                    };
                    var $167 = $167($165);
                    return $167;
                });
                var $147 = $166;
                break;
        };
        var $147 = $147(_b$3);
        return $147;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $180 = Word$adder$(_a$2, _b$3, Bool$false);
        return $180;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Word$mul$(_a$2, _b$3) {
        var Word$mul$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mul = _a$2 => _b$3 => Word$mul$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mul$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U16$mul = a0 => a1 => ((a0 * a1) & 0xFFFF);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $182 = (_b$5 => {
                    var $183 = Word$e;
                    return $183;
                });
                var $181 = $182;
                break;
            case 'Word.o':
                var $184 = self.pred;
                var $185 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $187 = (_a$pred$8 => {
                                var $188 = Word$e;
                                return $188;
                            });
                            var $186 = $187;
                            break;
                        case 'Word.o':
                            var $189 = self.pred;
                            var $190 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $192 = Word$i$(Word$subber$(_a$pred$10, $189, Bool$true));
                                    var $191 = $192;
                                } else {
                                    var $193 = Word$o$(Word$subber$(_a$pred$10, $189, Bool$false));
                                    var $191 = $193;
                                };
                                return $191;
                            });
                            var $186 = $190;
                            break;
                        case 'Word.i':
                            var $194 = self.pred;
                            var $195 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $197 = Word$o$(Word$subber$(_a$pred$10, $194, Bool$true));
                                    var $196 = $197;
                                } else {
                                    var $198 = Word$i$(Word$subber$(_a$pred$10, $194, Bool$true));
                                    var $196 = $198;
                                };
                                return $196;
                            });
                            var $186 = $195;
                            break;
                    };
                    var $186 = $186($184);
                    return $186;
                });
                var $181 = $185;
                break;
            case 'Word.i':
                var $199 = self.pred;
                var $200 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $202 = (_a$pred$8 => {
                                var $203 = Word$e;
                                return $203;
                            });
                            var $201 = $202;
                            break;
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $207 = Word$o$(Word$subber$(_a$pred$10, $204, Bool$false));
                                    var $206 = $207;
                                } else {
                                    var $208 = Word$i$(Word$subber$(_a$pred$10, $204, Bool$false));
                                    var $206 = $208;
                                };
                                return $206;
                            });
                            var $201 = $205;
                            break;
                        case 'Word.i':
                            var $209 = self.pred;
                            var $210 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $212 = Word$i$(Word$subber$(_a$pred$10, $209, Bool$true));
                                    var $211 = $212;
                                } else {
                                    var $213 = Word$o$(Word$subber$(_a$pred$10, $209, Bool$false));
                                    var $211 = $213;
                                };
                                return $211;
                            });
                            var $201 = $210;
                            break;
                    };
                    var $201 = $201($199);
                    return $201;
                });
                var $181 = $200;
                break;
        };
        var $181 = $181(_b$3);
        return $181;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $214 = Word$subber$(_a$2, _b$3, Bool$false);
        return $214;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function Char$hex_value16$(_chr$1) {
        var self = ((_chr$1 >= 48) && (_chr$1 <= 57));
        if (self) {
            var $216 = (Math.max(_chr$1 - 48, 0));
            var $215 = $216;
        } else {
            var self = ((_chr$1 >= 97) && (_chr$1 <= 102));
            if (self) {
                var $218 = (_x0$2 => {
                    var $219 = U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(_x0$2))))))))));
                    return $219;
                })((Math.max(_chr$1 - 97, 0)));
                var $217 = $218;
            } else {
                var self = ((_chr$1 >= 65) && (_chr$1 <= 70));
                if (self) {
                    var $221 = (_x0$2 => {
                        var $222 = U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(U16$inc$(_x0$2))))))))));
                        return $222;
                    })((Math.max(_chr$1 - 65, 0)));
                    var $220 = $221;
                } else {
                    var $223 = U16$zero;
                    var $220 = $223;
                };
                var $217 = $220;
            };
            var $215 = $217;
        };
        return $215;
    };
    const Char$hex_value16 = x0 => Char$hex_value16$(x0);

    function Fm$Core$read$u16$(_code$1, _u16$2) {
        var Fm$Core$read$u16$ = (_code$1, _u16$2) => ({
            ctr: 'TCO',
            arg: [_code$1, _u16$2]
        });
        var Fm$Core$read$u16 = _code$1 => _u16$2 => Fm$Core$read$u16$(_code$1, _u16$2);
        var arg = [_code$1, _u16$2];
        while (true) {
            let [_code$1, _u16$2] = arg;
            var R = (() => {
                var self = _code$1;
                if (self.length === 0) {
                    var $224 = Pair$new$(_code$1, _u16$2);
                    return $224;
                } else {
                    var $225 = self.charCodeAt(0);
                    var $226 = self.slice(1);
                    var self = Char$is_hex$($225);
                    if (self) {
                        var _u16$5 = ((((_u16$2 * 16) & 0xFFFF) + Char$hex_value16$($225)) & 0xFFFF);
                        var $228 = Fm$Core$read$u16$($226, _u16$5);
                        var $227 = $228;
                    } else {
                        var $229 = Pair$new$(_code$1, _u16$2);
                        var $227 = $229;
                    };
                    return $227;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Core$read$u16 = x0 => x1 => Fm$Core$read$u16$(x0, x1);

    function Fm$Core$read$chrx$(_code$1) {
        var self = String$starts_with$(_code$1, "\\u{");
        if (self) {
            var _code$2 = String$drop$(3n, _code$1);
            var self = Fm$Core$read$u16$(_code$2, 0);
            switch (self._) {
                case 'Pair.new':
                    var $232 = self.fst;
                    var $233 = self.snd;
                    var self = String$starts_with$($232, "}");
                    if (self) {
                        var $235 = Pair$new$(String$drop$(1n, $232), $233);
                        var $234 = $235;
                    } else {
                        var $236 = Pair$new$("", 63);
                        var $234 = $236;
                    };
                    var $231 = $234;
                    break;
            };
            var $230 = $231;
        } else {
            var $237 = Pair$new$("", 63);
            var $230 = $237;
        };
        return $230;
    };
    const Fm$Core$read$chrx = x0 => Fm$Core$read$chrx$(x0);

    function Fm$Term$chr$(_chrx$1) {
        var $238 = ({
            _: 'Fm.Term.chr',
            'chrx': _chrx$1
        });
        return $238;
    };
    const Fm$Term$chr = x0 => Fm$Term$chr$(x0);

    function Fm$Core$read$strx$(_code$1) {
        var self = String$starts_with$(_code$1, "\"");
        if (self) {
            var $240 = Pair$new$(_code$1, "");
            var $239 = $240;
        } else {
            var self = Fm$Core$read$chrx$(_code$1);
            switch (self._) {
                case 'Pair.new':
                    var $242 = self.fst;
                    var $243 = self.snd;
                    var self = Fm$Core$read$strx$($242);
                    switch (self._) {
                        case 'Pair.new':
                            var $245 = self.fst;
                            var $246 = self.snd;
                            var $247 = Pair$new$($245, String$cons$($243, $246));
                            var $244 = $247;
                            break;
                    };
                    var $241 = $244;
                    break;
            };
            var $239 = $241;
        };
        return $239;
    };
    const Fm$Core$read$strx = x0 => Fm$Core$read$strx$(x0);

    function Fm$Term$str$(_strx$1) {
        var $248 = ({
            _: 'Fm.Term.str',
            'strx': _strx$1
        });
        return $248;
    };
    const Fm$Term$str = x0 => Fm$Term$str$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Char$dec_value$(_chr$1) {
        var self = (_chr$1 === 48);
        if (self) {
            var $250 = 0n;
            var $249 = $250;
        } else {
            var self = (_chr$1 === 49);
            if (self) {
                var $252 = 1n;
                var $251 = $252;
            } else {
                var self = (_chr$1 === 50);
                if (self) {
                    var $254 = 2n;
                    var $253 = $254;
                } else {
                    var self = (_chr$1 === 51);
                    if (self) {
                        var $256 = 3n;
                        var $255 = $256;
                    } else {
                        var self = (_chr$1 === 52);
                        if (self) {
                            var $258 = 4n;
                            var $257 = $258;
                        } else {
                            var self = (_chr$1 === 53);
                            if (self) {
                                var $260 = 5n;
                                var $259 = $260;
                            } else {
                                var self = (_chr$1 === 54);
                                if (self) {
                                    var $262 = 6n;
                                    var $261 = $262;
                                } else {
                                    var self = (_chr$1 === 55);
                                    if (self) {
                                        var $264 = 7n;
                                        var $263 = $264;
                                    } else {
                                        var self = (_chr$1 === 56);
                                        if (self) {
                                            var $266 = 8n;
                                            var $265 = $266;
                                        } else {
                                            var self = (_chr$1 === 57);
                                            if (self) {
                                                var $268 = 9n;
                                                var $267 = $268;
                                            } else {
                                                var $269 = 0n;
                                                var $267 = $269;
                                            };
                                            var $265 = $267;
                                        };
                                        var $263 = $265;
                                    };
                                    var $261 = $263;
                                };
                                var $259 = $261;
                            };
                            var $257 = $259;
                        };
                        var $255 = $257;
                    };
                    var $253 = $255;
                };
                var $251 = $253;
            };
            var $249 = $251;
        };
        return $249;
    };
    const Char$dec_value = x0 => Char$dec_value$(x0);

    function Fm$Core$read$natx$(_code$1, _nat$2) {
        var Fm$Core$read$natx$ = (_code$1, _nat$2) => ({
            ctr: 'TCO',
            arg: [_code$1, _nat$2]
        });
        var Fm$Core$read$natx = _code$1 => _nat$2 => Fm$Core$read$natx$(_code$1, _nat$2);
        var arg = [_code$1, _nat$2];
        while (true) {
            let [_code$1, _nat$2] = arg;
            var R = (() => {
                var self = _code$1;
                if (self.length === 0) {
                    var $270 = Pair$new$(_code$1, _nat$2);
                    return $270;
                } else {
                    var $271 = self.charCodeAt(0);
                    var $272 = self.slice(1);
                    var self = Char$is_hex$($271);
                    if (self) {
                        var _nat$5 = ((_nat$2 * 10n) + Char$dec_value$($271));
                        var $274 = Fm$Core$read$natx$($272, _nat$5);
                        var $273 = $274;
                    } else {
                        var $275 = Pair$new$(_code$1, _nat$2);
                        var $273 = $275;
                    };
                    return $273;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Core$read$natx = x0 => x1 => Fm$Core$read$natx$(x0, x1);

    function Fm$Term$nat$(_natx$1) {
        var $276 = ({
            _: 'Fm.Term.nat',
            'natx': _natx$1
        });
        return $276;
    };
    const Fm$Term$nat = x0 => Fm$Term$nat$(x0);
    const String$eql = a0 => a1 => (a0 === a1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $278 = self.fst;
                var $279 = self.snd;
                var $280 = $278;
                var $277 = $280;
                break;
        };
        return $277;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Maybe$(_A$1) {
        var $281 = null;
        return $281;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Maybe$some$(_value$2) {
        var $282 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $282;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $284 = Nat$zero;
            var $283 = $284;
        } else {
            var $285 = (self - 1n);
            var $286 = $285;
            var $283 = $286;
        };
        return $283;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function Fm$Core$read$find$(_list$2, _cond$3, _indx$4, _skip$5) {
        var Fm$Core$read$find$ = (_list$2, _cond$3, _indx$4, _skip$5) => ({
            ctr: 'TCO',
            arg: [_list$2, _cond$3, _indx$4, _skip$5]
        });
        var Fm$Core$read$find = _list$2 => _cond$3 => _indx$4 => _skip$5 => Fm$Core$read$find$(_list$2, _cond$3, _indx$4, _skip$5);
        var arg = [_list$2, _cond$3, _indx$4, _skip$5];
        while (true) {
            let [_list$2, _cond$3, _indx$4, _skip$5] = arg;
            var R = (() => {
                var self = _list$2;
                switch (self._) {
                    case 'List.nil':
                        var $287 = Maybe$none;
                        return $287;
                    case 'List.cons':
                        var $288 = self.head;
                        var $289 = self.tail;
                        var self = _cond$3($288)(_indx$4);
                        if (self) {
                            var self = (_skip$5 === 0n);
                            if (self) {
                                var $292 = Maybe$some$(Pair$new$($288, _indx$4));
                                var $291 = $292;
                            } else {
                                var $293 = Fm$Core$read$find$($289, _cond$3, Nat$succ$(_indx$4), Nat$pred$(_skip$5));
                                var $291 = $293;
                            };
                            var $290 = $291;
                        } else {
                            var $294 = Fm$Core$read$find$($289, _cond$3, Nat$succ$(_indx$4), _skip$5);
                            var $290 = $294;
                        };
                        return $290;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Core$read$find = x0 => x1 => x2 => x3 => Fm$Core$read$find$(x0, x1, x2, x3);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $296 = self.fst;
                var $297 = self.snd;
                var $298 = $297;
                var $295 = $298;
                break;
        };
        return $295;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Core$read$term$(_code$1) {
        var $299 = ((console.log((_code$1 + String$nil)), (_x$2 => {
            var self = Fm$Core$read$spaces$(_code$1);
            switch (self._) {
                case 'Pair.new':
                    var $301 = self.fst;
                    var $302 = self.snd;
                    var self = $301;
                    if (self.length === 0) {
                        var $304 = Pair$new$("", (_ctx$5 => {
                            var $305 = Fm$Term$ref$("error");
                            return $305;
                        }));
                        var $303 = $304;
                    } else {
                        var $306 = self.charCodeAt(0);
                        var $307 = self.slice(1);
                        var _head$7 = $306;
                        var _code$8 = $307;
                        var self = Char$eql$(_head$7, 42);
                        if (self) {
                            var $309 = Pair$new$(_code$8, (_ctx$9 => {
                                var $310 = Fm$Term$typ;
                                return $310;
                            }));
                            var $308 = $309;
                        } else {
                            var self = (_head$7 === 64);
                            if (self) {
                                var self = Fm$Core$read$name$(_code$8);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $313 = self.fst;
                                        var $314 = self.snd;
                                        var self = Fm$Core$read$char$($313, 40);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $316 = self.fst;
                                                var $317 = self.snd;
                                                var self = Fm$Core$read$name$($316);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $319 = self.fst;
                                                        var $320 = self.snd;
                                                        var self = Fm$Core$read$char$($319, 58);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $322 = self.fst;
                                                                var $323 = self.snd;
                                                                var self = Fm$Core$read$term$($322);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $325 = self.fst;
                                                                        var $326 = self.snd;
                                                                        var self = Fm$Core$read$char$($325, 41);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $328 = self.fst;
                                                                                var $329 = self.snd;
                                                                                var self = Fm$Core$read$term$($328);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $331 = self.fst;
                                                                                        var $332 = self.snd;
                                                                                        var $333 = Pair$new$($331, (_ctx$23 => {
                                                                                            var $334 = Fm$Term$all$(Bool$false, $314, $320, $326(_ctx$23), (_s$24 => _x$25 => {
                                                                                                var $335 = $332(List$cons$(Pair$new$($320, _x$25), List$cons$(Pair$new$($314, _s$24), _ctx$23)));
                                                                                                return $335;
                                                                                            }));
                                                                                            return $334;
                                                                                        }));
                                                                                        var $330 = $333;
                                                                                        break;
                                                                                };
                                                                                var $327 = $330;
                                                                                break;
                                                                        };
                                                                        var $324 = $327;
                                                                        break;
                                                                };
                                                                var $321 = $324;
                                                                break;
                                                        };
                                                        var $318 = $321;
                                                        break;
                                                };
                                                var $315 = $318;
                                                break;
                                        };
                                        var $312 = $315;
                                        break;
                                };
                                var $311 = $312;
                            } else {
                                var self = (_head$7 === 37);
                                if (self) {
                                    var self = Fm$Core$read$name$(_code$8);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $338 = self.fst;
                                            var $339 = self.snd;
                                            var self = Fm$Core$read$char$($338, 40);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $341 = self.fst;
                                                    var $342 = self.snd;
                                                    var self = Fm$Core$read$name$($341);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $344 = self.fst;
                                                            var $345 = self.snd;
                                                            var self = Fm$Core$read$char$($344, 58);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $347 = self.fst;
                                                                    var $348 = self.snd;
                                                                    var self = Fm$Core$read$term$($347);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $350 = self.fst;
                                                                            var $351 = self.snd;
                                                                            var self = Fm$Core$read$char$($350, 41);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $353 = self.fst;
                                                                                    var $354 = self.snd;
                                                                                    var self = Fm$Core$read$term$($353);
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $356 = self.fst;
                                                                                            var $357 = self.snd;
                                                                                            var $358 = Pair$new$($356, (_ctx$23 => {
                                                                                                var $359 = Fm$Term$all$(Bool$true, $339, $345, $351(_ctx$23), (_s$24 => _x$25 => {
                                                                                                    var $360 = $357(List$cons$(Pair$new$($345, _x$25), List$cons$(Pair$new$($339, _s$24), _ctx$23)));
                                                                                                    return $360;
                                                                                                }));
                                                                                                return $359;
                                                                                            }));
                                                                                            var $355 = $358;
                                                                                            break;
                                                                                    };
                                                                                    var $352 = $355;
                                                                                    break;
                                                                            };
                                                                            var $349 = $352;
                                                                            break;
                                                                    };
                                                                    var $346 = $349;
                                                                    break;
                                                            };
                                                            var $343 = $346;
                                                            break;
                                                    };
                                                    var $340 = $343;
                                                    break;
                                            };
                                            var $337 = $340;
                                            break;
                                    };
                                    var $336 = $337;
                                } else {
                                    var self = (_head$7 === 35);
                                    if (self) {
                                        var self = Fm$Core$read$name$(_code$8);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $363 = self.fst;
                                                var $364 = self.snd;
                                                var self = Fm$Core$read$term$($363);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $366 = self.fst;
                                                        var $367 = self.snd;
                                                        var $368 = Pair$new$($366, (_ctx$13 => {
                                                            var $369 = Fm$Term$lam$($364, (_x$14 => {
                                                                var $370 = $367(List$cons$(Pair$new$($364, _x$14), _ctx$13));
                                                                return $370;
                                                            }));
                                                            return $369;
                                                        }));
                                                        var $365 = $368;
                                                        break;
                                                };
                                                var $362 = $365;
                                                break;
                                        };
                                        var $361 = $362;
                                    } else {
                                        var self = (_head$7 === 40);
                                        if (self) {
                                            var self = Fm$Core$read$term$(_code$8);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $373 = self.fst;
                                                    var $374 = self.snd;
                                                    var self = Fm$Core$read$term$($373);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $376 = self.fst;
                                                            var $377 = self.snd;
                                                            var self = Fm$Core$read$char$($376, 41);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $379 = self.fst;
                                                                    var $380 = self.snd;
                                                                    var $381 = Pair$new$($379, (_ctx$15 => {
                                                                        var $382 = Fm$Term$app$($374(_ctx$15), $377(_ctx$15));
                                                                        return $382;
                                                                    }));
                                                                    var $378 = $381;
                                                                    break;
                                                            };
                                                            var $375 = $378;
                                                            break;
                                                    };
                                                    var $372 = $375;
                                                    break;
                                            };
                                            var $371 = $372;
                                        } else {
                                            var self = (_head$7 === 33);
                                            if (self) {
                                                var self = Fm$Core$read$name$(_code$8);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $385 = self.fst;
                                                        var $386 = self.snd;
                                                        var self = Fm$Core$read$char$($385, 61);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $388 = self.fst;
                                                                var $389 = self.snd;
                                                                var self = Fm$Core$read$term$($388);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $391 = self.fst;
                                                                        var $392 = self.snd;
                                                                        var self = Fm$Core$read$char$($391, 59);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $394 = self.fst;
                                                                                var $395 = self.snd;
                                                                                var self = Fm$Core$read$term$($394);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $397 = self.fst;
                                                                                        var $398 = self.snd;
                                                                                        var $399 = Pair$new$($397, (_ctx$19 => {
                                                                                            var $400 = Fm$Term$let$($386, $392(_ctx$19), (_x$20 => {
                                                                                                var $401 = $398(List$cons$(Pair$new$($386, _x$20), _ctx$19));
                                                                                                return $401;
                                                                                            }));
                                                                                            return $400;
                                                                                        }));
                                                                                        var $396 = $399;
                                                                                        break;
                                                                                };
                                                                                var $393 = $396;
                                                                                break;
                                                                        };
                                                                        var $390 = $393;
                                                                        break;
                                                                };
                                                                var $387 = $390;
                                                                break;
                                                        };
                                                        var $384 = $387;
                                                        break;
                                                };
                                                var $383 = $384;
                                            } else {
                                                var self = (_head$7 === 36);
                                                if (self) {
                                                    var self = Fm$Core$read$name$(_code$8);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $404 = self.fst;
                                                            var $405 = self.snd;
                                                            var self = Fm$Core$read$char$($404, 61);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $407 = self.fst;
                                                                    var $408 = self.snd;
                                                                    var self = Fm$Core$read$term$($407);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $410 = self.fst;
                                                                            var $411 = self.snd;
                                                                            var self = Fm$Core$read$char$($410, 59);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $413 = self.fst;
                                                                                    var $414 = self.snd;
                                                                                    var self = Fm$Core$read$term$($413);
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $416 = self.fst;
                                                                                            var $417 = self.snd;
                                                                                            var $418 = Pair$new$($416, (_ctx$19 => {
                                                                                                var $419 = Fm$Term$def$($405, $411(_ctx$19), (_x$20 => {
                                                                                                    var $420 = $417(List$cons$(Pair$new$($405, _x$20), _ctx$19));
                                                                                                    return $420;
                                                                                                }));
                                                                                                return $419;
                                                                                            }));
                                                                                            var $415 = $418;
                                                                                            break;
                                                                                    };
                                                                                    var $412 = $415;
                                                                                    break;
                                                                            };
                                                                            var $409 = $412;
                                                                            break;
                                                                    };
                                                                    var $406 = $409;
                                                                    break;
                                                            };
                                                            var $403 = $406;
                                                            break;
                                                    };
                                                    var $402 = $403;
                                                } else {
                                                    var self = (_head$7 === 123);
                                                    if (self) {
                                                        var self = Fm$Core$read$term$(_code$8);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $423 = self.fst;
                                                                var $424 = self.snd;
                                                                var self = Fm$Core$read$char$($423, 58);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $426 = self.fst;
                                                                        var $427 = self.snd;
                                                                        var self = Fm$Core$read$term$($426);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $429 = self.fst;
                                                                                var $430 = self.snd;
                                                                                var self = Fm$Core$read$char$($429, 125);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $432 = self.fst;
                                                                                        var $433 = self.snd;
                                                                                        var $434 = Pair$new$($432, (_ctx$17 => {
                                                                                            var $435 = Fm$Term$ann$(Bool$false, $424(_ctx$17), $430(_ctx$17));
                                                                                            return $435;
                                                                                        }));
                                                                                        var $431 = $434;
                                                                                        break;
                                                                                };
                                                                                var $428 = $431;
                                                                                break;
                                                                        };
                                                                        var $425 = $428;
                                                                        break;
                                                                };
                                                                var $422 = $425;
                                                                break;
                                                        };
                                                        var $421 = $422;
                                                    } else {
                                                        var self = (_head$7 === 39);
                                                        if (self) {
                                                            var self = Fm$Core$read$chrx$(_code$8);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $438 = self.fst;
                                                                    var $439 = self.snd;
                                                                    var self = Fm$Core$read$char$($438, 39);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $441 = self.fst;
                                                                            var $442 = self.snd;
                                                                            var $443 = Pair$new$($441, (_ctx$13 => {
                                                                                var $444 = Fm$Term$chr$($439);
                                                                                return $444;
                                                                            }));
                                                                            var $440 = $443;
                                                                            break;
                                                                    };
                                                                    var $437 = $440;
                                                                    break;
                                                            };
                                                            var $436 = $437;
                                                        } else {
                                                            var self = (_head$7 === 34);
                                                            if (self) {
                                                                var self = Fm$Core$read$strx$(_code$8);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $447 = self.fst;
                                                                        var $448 = self.snd;
                                                                        var self = Fm$Core$read$char$($447, 34);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $450 = self.fst;
                                                                                var $451 = self.snd;
                                                                                var $452 = Pair$new$($450, (_ctx$13 => {
                                                                                    var $453 = Fm$Term$str$($448);
                                                                                    return $453;
                                                                                }));
                                                                                var $449 = $452;
                                                                                break;
                                                                        };
                                                                        var $446 = $449;
                                                                        break;
                                                                };
                                                                var $445 = $446;
                                                            } else {
                                                                var self = (_head$7 === 43);
                                                                if (self) {
                                                                    var self = Fm$Core$read$natx$(_code$8, 0n);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $456 = self.fst;
                                                                            var $457 = self.snd;
                                                                            var $458 = Pair$new$($456, (_ctx$11 => {
                                                                                var $459 = Fm$Term$nat$($457);
                                                                                return $459;
                                                                            }));
                                                                            var $455 = $458;
                                                                            break;
                                                                    };
                                                                    var $454 = $455;
                                                                } else {
                                                                    var self = Fm$Core$read$is_name$(_head$7);
                                                                    if (self) {
                                                                        var self = Fm$Core$read$name$(_code$8);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $462 = self.fst;
                                                                                var $463 = self.snd;
                                                                                var _name$11 = String$cons$(_head$7, $463);
                                                                                var self = (_head$7 === 94);
                                                                                if (self) {
                                                                                    var $465 = Fm$Core$read$natx$($462, 0n);
                                                                                    var self = $465;
                                                                                } else {
                                                                                    var $466 = Pair$new$($462, 0n);
                                                                                    var self = $466;
                                                                                };
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $467 = self.fst;
                                                                                        var $468 = self.snd;
                                                                                        var $469 = Pair$new$($467, (_ctx$14 => {
                                                                                            var _got$15 = Fm$Core$read$find$(_ctx$14, (_x$15 => _i$16 => {
                                                                                                var $471 = (Pair$fst$(_x$15) === _name$11);
                                                                                                return $471;
                                                                                            }), 0n, $468);
                                                                                            var self = _got$15;
                                                                                            switch (self._) {
                                                                                                case 'Maybe.none':
                                                                                                    var $472 = Fm$Term$ref$(_name$11);
                                                                                                    var $470 = $472;
                                                                                                    break;
                                                                                                case 'Maybe.some':
                                                                                                    var $473 = self.value;
                                                                                                    var $474 = Pair$snd$(Pair$fst$($473));
                                                                                                    var $470 = $474;
                                                                                                    break;
                                                                                            };
                                                                                            return $470;
                                                                                        }));
                                                                                        var $464 = $469;
                                                                                        break;
                                                                                };
                                                                                var $461 = $464;
                                                                                break;
                                                                        };
                                                                        var $460 = $461;
                                                                    } else {
                                                                        var $475 = Pair$new$("", (_ctx$9 => {
                                                                            var $476 = Fm$Term$ref$("error");
                                                                            return $476;
                                                                        }));
                                                                        var $460 = $475;
                                                                    };
                                                                    var $454 = $460;
                                                                };
                                                                var $445 = $454;
                                                            };
                                                            var $436 = $445;
                                                        };
                                                        var $421 = $436;
                                                    };
                                                    var $402 = $421;
                                                };
                                                var $383 = $402;
                                            };
                                            var $371 = $383;
                                        };
                                        var $361 = $371;
                                    };
                                    var $336 = $361;
                                };
                                var $311 = $336;
                            };
                            var $308 = $311;
                        };
                        var $303 = $308;
                    };
                    var $300 = $303;
                    break;
            };
            return $300;
        })()));
        return $299;
    };
    const Fm$Core$read$term = x0 => Fm$Core$read$term$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $478 = Maybe$none;
                var $477 = $478;
                break;
            case 'Maybe.some':
                var $479 = self.value;
                var $480 = Maybe$some$(_f$4($479));
                var $477 = $480;
                break;
        };
        return $477;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $482 = Maybe$none;
                var $481 = $482;
                break;
            case 'Maybe.some':
                var $483 = self.value;
                var $484 = _f$4($483);
                var $481 = $484;
                break;
        };
        return $481;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $485 = _new$2(Maybe$bind)(Maybe$some);
        return $485;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $487 = self.name;
                var $488 = self.indx;
                var $489 = Maybe$none;
                var $486 = $489;
                break;
            case 'Fm.Term.ref':
                var $490 = self.name;
                var self = ($490 === "Nat.zero");
                if (self) {
                    var $492 = Maybe$some$(0n);
                    var $491 = $492;
                } else {
                    var $493 = Maybe$none;
                    var $491 = $493;
                };
                var $486 = $491;
                break;
            case 'Fm.Term.typ':
                var $494 = Maybe$none;
                var $486 = $494;
                break;
            case 'Fm.Term.all':
                var $495 = self.eras;
                var $496 = self.self;
                var $497 = self.name;
                var $498 = self.xtyp;
                var $499 = self.body;
                var $500 = Maybe$none;
                var $486 = $500;
                break;
            case 'Fm.Term.lam':
                var $501 = self.name;
                var $502 = self.body;
                var $503 = Maybe$none;
                var $486 = $503;
                break;
            case 'Fm.Term.app':
                var $504 = self.func;
                var $505 = self.argm;
                var self = $504;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $507 = self.name;
                        var $508 = self.indx;
                        var $509 = Maybe$none;
                        var $506 = $509;
                        break;
                    case 'Fm.Term.ref':
                        var $510 = self.name;
                        var self = ($510 === "Nat.succ");
                        if (self) {
                            var $512 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $513 = _m$bind$5;
                                return $513;
                            }))(Fm$Term$show$as_nat$go$($505))((_pred$5 => {
                                var $514 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $515 = _m$pure$7;
                                    return $515;
                                }))(Nat$succ$(_pred$5));
                                return $514;
                            }));
                            var $511 = $512;
                        } else {
                            var $516 = Maybe$none;
                            var $511 = $516;
                        };
                        var $506 = $511;
                        break;
                    case 'Fm.Term.typ':
                        var $517 = Maybe$none;
                        var $506 = $517;
                        break;
                    case 'Fm.Term.all':
                        var $518 = self.eras;
                        var $519 = self.self;
                        var $520 = self.name;
                        var $521 = self.xtyp;
                        var $522 = self.body;
                        var $523 = Maybe$none;
                        var $506 = $523;
                        break;
                    case 'Fm.Term.lam':
                        var $524 = self.name;
                        var $525 = self.body;
                        var $526 = Maybe$none;
                        var $506 = $526;
                        break;
                    case 'Fm.Term.app':
                        var $527 = self.func;
                        var $528 = self.argm;
                        var $529 = Maybe$none;
                        var $506 = $529;
                        break;
                    case 'Fm.Term.let':
                        var $530 = self.name;
                        var $531 = self.expr;
                        var $532 = self.body;
                        var $533 = Maybe$none;
                        var $506 = $533;
                        break;
                    case 'Fm.Term.def':
                        var $534 = self.name;
                        var $535 = self.expr;
                        var $536 = self.body;
                        var $537 = Maybe$none;
                        var $506 = $537;
                        break;
                    case 'Fm.Term.ann':
                        var $538 = self.done;
                        var $539 = self.term;
                        var $540 = self.type;
                        var $541 = Maybe$none;
                        var $506 = $541;
                        break;
                    case 'Fm.Term.gol':
                        var $542 = self.name;
                        var $543 = self.dref;
                        var $544 = self.verb;
                        var $545 = Maybe$none;
                        var $506 = $545;
                        break;
                    case 'Fm.Term.hol':
                        var $546 = self.path;
                        var $547 = Maybe$none;
                        var $506 = $547;
                        break;
                    case 'Fm.Term.nat':
                        var $548 = self.natx;
                        var $549 = Maybe$none;
                        var $506 = $549;
                        break;
                    case 'Fm.Term.chr':
                        var $550 = self.chrx;
                        var $551 = Maybe$none;
                        var $506 = $551;
                        break;
                    case 'Fm.Term.str':
                        var $552 = self.strx;
                        var $553 = Maybe$none;
                        var $506 = $553;
                        break;
                    case 'Fm.Term.cse':
                        var $554 = self.path;
                        var $555 = self.expr;
                        var $556 = self.name;
                        var $557 = self.with;
                        var $558 = self.cses;
                        var $559 = self.moti;
                        var $560 = Maybe$none;
                        var $506 = $560;
                        break;
                    case 'Fm.Term.ori':
                        var $561 = self.orig;
                        var $562 = self.expr;
                        var $563 = Maybe$none;
                        var $506 = $563;
                        break;
                };
                var $486 = $506;
                break;
            case 'Fm.Term.let':
                var $564 = self.name;
                var $565 = self.expr;
                var $566 = self.body;
                var $567 = Maybe$none;
                var $486 = $567;
                break;
            case 'Fm.Term.def':
                var $568 = self.name;
                var $569 = self.expr;
                var $570 = self.body;
                var $571 = Maybe$none;
                var $486 = $571;
                break;
            case 'Fm.Term.ann':
                var $572 = self.done;
                var $573 = self.term;
                var $574 = self.type;
                var $575 = Maybe$none;
                var $486 = $575;
                break;
            case 'Fm.Term.gol':
                var $576 = self.name;
                var $577 = self.dref;
                var $578 = self.verb;
                var $579 = Maybe$none;
                var $486 = $579;
                break;
            case 'Fm.Term.hol':
                var $580 = self.path;
                var $581 = Maybe$none;
                var $486 = $581;
                break;
            case 'Fm.Term.nat':
                var $582 = self.natx;
                var $583 = Maybe$none;
                var $486 = $583;
                break;
            case 'Fm.Term.chr':
                var $584 = self.chrx;
                var $585 = Maybe$none;
                var $486 = $585;
                break;
            case 'Fm.Term.str':
                var $586 = self.strx;
                var $587 = Maybe$none;
                var $486 = $587;
                break;
            case 'Fm.Term.cse':
                var $588 = self.path;
                var $589 = self.expr;
                var $590 = self.name;
                var $591 = self.with;
                var $592 = self.cses;
                var $593 = self.moti;
                var $594 = Maybe$none;
                var $486 = $594;
                break;
            case 'Fm.Term.ori':
                var $595 = self.orig;
                var $596 = self.expr;
                var $597 = Maybe$none;
                var $486 = $597;
                break;
        };
        return $486;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $599 = _nil$4;
                var $598 = $599;
                break;
            case 'List.cons':
                var $600 = self.head;
                var $601 = self.tail;
                var $602 = _cons$5($600)(List$fold$($601, _nil$4, _cons$5));
                var $598 = $602;
                break;
        };
        return $598;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $603 = null;
        return $603;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $604 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $604;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $605 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $605;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $606 = Either$left$(_n$1);
                    return $606;
                } else {
                    var $607 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $609 = Either$right$(Nat$succ$($607));
                        var $608 = $609;
                    } else {
                        var $610 = (self - 1n);
                        var $611 = Nat$sub_rem$($610, $607);
                        var $608 = $611;
                    };
                    return $608;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $612 = self.value;
                        var $613 = Nat$div_mod$go$($612, _m$2, Nat$succ$(_d$3));
                        return $613;
                    case 'Either.right':
                        var $614 = self.value;
                        var $615 = Pair$new$(_d$3, _n$1);
                        return $615;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function List$(_A$1) {
        var $616 = null;
        return $616;
    };
    const List = x0 => List$(x0);

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $617 = self.fst;
                        var $618 = self.snd;
                        var self = $617;
                        if (self === 0n) {
                            var $620 = List$cons$($618, _res$3);
                            var $619 = $620;
                        } else {
                            var $621 = (self - 1n);
                            var $622 = Nat$to_base$go$(_base$1, $617, List$cons$($618, _res$3));
                            var $619 = $622;
                        };
                        return $619;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $623 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $623;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $624 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $624;
                } else {
                    var $625 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $627 = _r$3;
                        var $626 = $627;
                    } else {
                        var $628 = (self - 1n);
                        var $629 = Nat$mod$go$($628, $625, Nat$succ$(_r$3));
                        var $626 = $629;
                    };
                    return $626;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $630 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $630;
    };
    const Nat$mod = x0 => x1 => Nat$mod$(x0, x1);
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.nil':
                        var $631 = Maybe$none;
                        return $631;
                    case 'List.cons':
                        var $632 = self.head;
                        var $633 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $635 = Maybe$some$($632);
                            var $634 = $635;
                        } else {
                            var $636 = (self - 1n);
                            var $637 = List$at$($636, $633);
                            var $634 = $637;
                        };
                        return $634;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = Nat$mod$(_n$2, _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.none':
                    var $640 = 35;
                    var $639 = $640;
                    break;
                case 'Maybe.some':
                    var $641 = self.value;
                    var $642 = $641;
                    var $639 = $642;
                    break;
            };
            var $638 = $639;
        } else {
            var $643 = 35;
            var $638 = $643;
        };
        return $638;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $644 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $645 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $645;
        }));
        return $644;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $646 = Nat$to_string_base$(10n, _n$1);
        return $646;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $647 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $647;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Name$show$(_name$1) {
        var $648 = _name$1;
        return $648;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);
    const Bits$e = '';

    function Fm$Path$to_bits$(_path$1) {
        var $649 = _path$1(Bits$e);
        return $649;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $651 = 0n;
                var $650 = $651;
                break;
            case 'o':
                var $652 = self.slice(0, -1);
                var $653 = (2n * Bits$to_nat$($652));
                var $650 = $653;
                break;
            case 'i':
                var $654 = self.slice(0, -1);
                var $655 = Nat$succ$((2n * Bits$to_nat$($654)));
                var $650 = $655;
                break;
        };
        return $650;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function String$flatten$go$(_xs$1, _res$2) {
        var String$flatten$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.nil':
                        var $656 = _res$2;
                        return $656;
                    case 'List.cons':
                        var $657 = self.head;
                        var $658 = self.tail;
                        var $659 = String$flatten$go$($658, (_res$2 + $657));
                        return $659;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $660 = String$flatten$go$(_xs$1, "");
        return $660;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function Fm$color$(_col$1, _str$2) {
        var $661 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $661;
    };
    const Fm$color = x0 => x1 => Fm$color$(x0, x1);

    function Fm$Path$o$(_path$1, _x$2) {
        var $662 = _path$1((_x$2 + '0'));
        return $662;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $663 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $663;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $664 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $664;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $665 = _path$1((_x$2 + '1'));
        return $665;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$MPath$i$(_path$1) {
        var $666 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $666;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);
    const List$length = a0 => (list_length(a0));

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $668 = self.name;
                var $669 = self.indx;
                var $670 = Bool$false;
                var $667 = $670;
                break;
            case 'Fm.Term.ref':
                var $671 = self.name;
                var $672 = (_name$2 === $671);
                var $667 = $672;
                break;
            case 'Fm.Term.typ':
                var $673 = Bool$false;
                var $667 = $673;
                break;
            case 'Fm.Term.all':
                var $674 = self.eras;
                var $675 = self.self;
                var $676 = self.name;
                var $677 = self.xtyp;
                var $678 = self.body;
                var $679 = Bool$false;
                var $667 = $679;
                break;
            case 'Fm.Term.lam':
                var $680 = self.name;
                var $681 = self.body;
                var $682 = Bool$false;
                var $667 = $682;
                break;
            case 'Fm.Term.app':
                var $683 = self.func;
                var $684 = self.argm;
                var $685 = Bool$false;
                var $667 = $685;
                break;
            case 'Fm.Term.let':
                var $686 = self.name;
                var $687 = self.expr;
                var $688 = self.body;
                var $689 = Bool$false;
                var $667 = $689;
                break;
            case 'Fm.Term.def':
                var $690 = self.name;
                var $691 = self.expr;
                var $692 = self.body;
                var $693 = Bool$false;
                var $667 = $693;
                break;
            case 'Fm.Term.ann':
                var $694 = self.done;
                var $695 = self.term;
                var $696 = self.type;
                var $697 = Bool$false;
                var $667 = $697;
                break;
            case 'Fm.Term.gol':
                var $698 = self.name;
                var $699 = self.dref;
                var $700 = self.verb;
                var $701 = Bool$false;
                var $667 = $701;
                break;
            case 'Fm.Term.hol':
                var $702 = self.path;
                var $703 = Bool$false;
                var $667 = $703;
                break;
            case 'Fm.Term.nat':
                var $704 = self.natx;
                var $705 = Bool$false;
                var $667 = $705;
                break;
            case 'Fm.Term.chr':
                var $706 = self.chrx;
                var $707 = Bool$false;
                var $667 = $707;
                break;
            case 'Fm.Term.str':
                var $708 = self.strx;
                var $709 = Bool$false;
                var $667 = $709;
                break;
            case 'Fm.Term.cse':
                var $710 = self.path;
                var $711 = self.expr;
                var $712 = self.name;
                var $713 = self.with;
                var $714 = self.cses;
                var $715 = self.moti;
                var $716 = Bool$false;
                var $667 = $716;
                break;
            case 'Fm.Term.ori':
                var $717 = self.orig;
                var $718 = self.expr;
                var $719 = Bool$false;
                var $667 = $719;
                break;
        };
        return $667;
    };
    const Fm$Term$show$is_ref = x0 => x1 => Fm$Term$show$is_ref$(x0, x1);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $721 = _a$2;
                var $720 = $721;
                break;
            case 'Maybe.some':
                var $722 = self.value;
                var $723 = $722;
                var $720 = $723;
                break;
        };
        return $720;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $725 = "";
                var $724 = $725;
                break;
            case 'List.cons':
                var $726 = self.head;
                var $727 = self.tail;
                var $728 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $729 = "";
                        return $729;
                    } else {
                        var $730 = _sep$1;
                        return $730;
                    };
                })(), List$cons$($726, List$cons$(String$join$go$(_sep$1, $727, Bool$false), List$nil))));
                var $724 = $728;
                break;
        };
        return $724;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $731 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $731;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $733 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $732 = $733;
        } else {
            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $735 = Bool$false;
                var _wrap$6 = $735;
            } else {
                var $736 = self.charCodeAt(0);
                var $737 = self.slice(1);
                var $738 = ($736 === 40);
                var _wrap$6 = $738;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $739 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $739;
            } else {
                var $740 = _func$5;
                var _func$8 = $740;
            };
            var $734 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $732 = $734;
        };
        return $732;
    };
    const Fm$Term$show$app$done = x0 => x1 => x2 => Fm$Term$show$app$done$(x0, x1, x2);

    function Fm$Term$show$app$(_term$1, _path$2, _args$3) {
        var Fm$Term$show$app$ = (_term$1, _path$2, _args$3) => ({
            ctr: 'TCO',
            arg: [_term$1, _path$2, _args$3]
        });
        var Fm$Term$show$app = _term$1 => _path$2 => _args$3 => Fm$Term$show$app$(_term$1, _path$2, _args$3);
        var arg = [_term$1, _path$2, _args$3];
        while (true) {
            let [_term$1, _path$2, _args$3] = arg;
            var R = (() => {
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $741 = self.name;
                        var $742 = self.indx;
                        var $743 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $743;
                    case 'Fm.Term.ref':
                        var $744 = self.name;
                        var $745 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $745;
                    case 'Fm.Term.typ':
                        var $746 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $746;
                    case 'Fm.Term.all':
                        var $747 = self.eras;
                        var $748 = self.self;
                        var $749 = self.name;
                        var $750 = self.xtyp;
                        var $751 = self.body;
                        var $752 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $752;
                    case 'Fm.Term.lam':
                        var $753 = self.name;
                        var $754 = self.body;
                        var $755 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $755;
                    case 'Fm.Term.app':
                        var $756 = self.func;
                        var $757 = self.argm;
                        var $758 = Fm$Term$show$app$($756, Fm$MPath$o$(_path$2), List$cons$(Fm$Term$show$go$($757, Fm$MPath$i$(_path$2)), _args$3));
                        return $758;
                    case 'Fm.Term.let':
                        var $759 = self.name;
                        var $760 = self.expr;
                        var $761 = self.body;
                        var $762 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $762;
                    case 'Fm.Term.def':
                        var $763 = self.name;
                        var $764 = self.expr;
                        var $765 = self.body;
                        var $766 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $766;
                    case 'Fm.Term.ann':
                        var $767 = self.done;
                        var $768 = self.term;
                        var $769 = self.type;
                        var $770 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $770;
                    case 'Fm.Term.gol':
                        var $771 = self.name;
                        var $772 = self.dref;
                        var $773 = self.verb;
                        var $774 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $774;
                    case 'Fm.Term.hol':
                        var $775 = self.path;
                        var $776 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $776;
                    case 'Fm.Term.nat':
                        var $777 = self.natx;
                        var $778 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $778;
                    case 'Fm.Term.chr':
                        var $779 = self.chrx;
                        var $780 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $780;
                    case 'Fm.Term.str':
                        var $781 = self.strx;
                        var $782 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $782;
                    case 'Fm.Term.cse':
                        var $783 = self.path;
                        var $784 = self.expr;
                        var $785 = self.name;
                        var $786 = self.with;
                        var $787 = self.cses;
                        var $788 = self.moti;
                        var $789 = Fm$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $789;
                    case 'Fm.Term.ori':
                        var $790 = self.orig;
                        var $791 = self.expr;
                        var $792 = Fm$Term$show$app$($791, _path$2, _args$3);
                        return $792;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Term$show$app = x0 => x1 => x2 => Fm$Term$show$app$(x0, x1, x2);
    const Fm$backslash = 92;

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $793 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $793;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $795 = Bits$e;
                var $794 = $795;
                break;
            case 'Word.o':
                var $796 = self.pred;
                var $797 = (Word$to_bits$($796) + '0');
                var $794 = $797;
                break;
            case 'Word.i':
                var $798 = self.pred;
                var $799 = (Word$to_bits$($798) + '1');
                var $794 = $799;
                break;
        };
        return $794;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $801 = u16_to_word(self);
                var $802 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($801)));
                var $800 = $802;
                break;
        };
        return $800;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $804 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $803 = $804;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $806 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $805 = $806;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $808 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $807 = $808;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $810 = String$cons$(_chr$1, String$nil);
                        var $809 = $810;
                    } else {
                        var $811 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $809 = $811;
                    };
                    var $807 = $809;
                };
                var $805 = $807;
            };
            var $803 = $805;
        };
        return $803;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $813 = String$nil;
            var $812 = $813;
        } else {
            var $814 = self.charCodeAt(0);
            var $815 = self.slice(1);
            var _head$4 = Fm$escape$char$($814);
            var _tail$5 = Fm$escape$($815);
            var $816 = (_head$4 + _tail$5);
            var $812 = $816;
        };
        return $812;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $818 = List$nil;
                var $817 = $818;
                break;
            case 'List.cons':
                var $819 = self.head;
                var $820 = self.tail;
                var $821 = List$cons$(_f$4($819), List$mapped$($820, _f$4));
                var $817 = $821;
                break;
        };
        return $817;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.nil':
                        var $822 = _res$3;
                        return $822;
                    case 'List.cons':
                        var $823 = self.head;
                        var $824 = self.tail;
                        var $825 = List$reverse$go$($824, List$cons$($823, _res$3));
                        return $825;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $826 = List$reverse$go$(_xs$2, List$nil);
        return $826;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _r$2]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [_a$1, _r$2];
        while (true) {
            let [_a$1, _r$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $827 = _r$2;
                        return $827;
                    case 'o':
                        var $828 = self.slice(0, -1);
                        var $829 = Bits$reverse$tco$($828, (_r$2 + '0'));
                        return $829;
                    case 'i':
                        var $830 = self.slice(0, -1);
                        var $831 = Bits$reverse$tco$($830, (_r$2 + '1'));
                        return $831;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $832 = Bits$reverse$tco$(_a$1, Bits$e);
        return $832;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function Map$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $834 = _list$4;
                var $833 = $834;
                break;
            case 'Map.tie':
                var $835 = self.val;
                var $836 = self.lft;
                var $837 = self.rgt;
                var self = $835;
                switch (self._) {
                    case 'Maybe.none':
                        var $839 = _list$4;
                        var _list0$8 = $839;
                        break;
                    case 'Maybe.some':
                        var $840 = self.value;
                        var $841 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $840), _list$4);
                        var _list0$8 = $841;
                        break;
                };
                var _list1$9 = Map$to_list$go$($836, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($837, (_key$3 + '1'), _list1$9);
                var $838 = _list2$10;
                var $833 = $838;
                break;
        };
        return $833;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $842 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $842;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $844 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $843 = $844;
                break;
            case 'o':
                var $845 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $847 = List$cons$(_head$6, _tail$7);
                    var $846 = $847;
                } else {
                    var $848 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $849 = Bits$chunks_of$go$(_len$1, $845, $848, _chunk$7);
                    var $846 = $849;
                };
                var $843 = $846;
                break;
            case 'i':
                var $850 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $852 = List$cons$(_head$6, _tail$7);
                    var $851 = $852;
                } else {
                    var $853 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $854 = Bits$chunks_of$go$(_len$1, $850, $853, _chunk$7);
                    var $851 = $854;
                };
                var $843 = $851;
                break;
        };
        return $843;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $855 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $855;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $857 = Word$e;
            var $856 = $857;
        } else {
            var $858 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $860 = Word$o$(Word$from_bits$($858, Bits$e));
                    var $859 = $860;
                    break;
                case 'o':
                    var $861 = self.slice(0, -1);
                    var $862 = Word$o$(Word$from_bits$($858, $861));
                    var $859 = $862;
                    break;
                case 'i':
                    var $863 = self.slice(0, -1);
                    var $864 = Word$i$(Word$from_bits$($858, $863));
                    var $859 = $864;
                    break;
            };
            var $856 = $859;
        };
        return $856;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $867 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $867;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $869 = ((_u16$5 + 71) & 0xFFFF);
                    var $868 = $869;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $871 = (Math.max(_u16$5 - 4, 0));
                        var $870 = $871;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $873 = 46;
                            var $872 = $873;
                        } else {
                            var $874 = 95;
                            var $872 = $874;
                        };
                        var $870 = $872;
                    };
                    var $868 = $870;
                };
                var _chr$6 = $868;
            };
            var $866 = String$cons$(_chr$6, _name$4);
            return $866;
        }));
        var $865 = _name$3;
        return $865;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $877 = self.name;
                        var $878 = self.indx;
                        var $879 = Fm$Name$show$($877);
                        var $876 = $879;
                        break;
                    case 'Fm.Term.ref':
                        var $880 = self.name;
                        var _name$4 = Fm$Name$show$($880);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $882 = _name$4;
                                var $881 = $882;
                                break;
                            case 'Maybe.some':
                                var $883 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($883));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $884 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $881 = $884;
                                break;
                        };
                        var $876 = $881;
                        break;
                    case 'Fm.Term.typ':
                        var $885 = "Type";
                        var $876 = $885;
                        break;
                    case 'Fm.Term.all':
                        var $886 = self.eras;
                        var $887 = self.self;
                        var $888 = self.name;
                        var $889 = self.xtyp;
                        var $890 = self.body;
                        var _eras$8 = $886;
                        var _self$9 = Fm$Name$show$($887);
                        var _name$10 = Fm$Name$show$($888);
                        var _type$11 = Fm$Term$show$go$($889, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $892 = "<";
                            var _open$12 = $892;
                        } else {
                            var $893 = "(";
                            var _open$12 = $893;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $894 = ">";
                            var _clos$13 = $894;
                        } else {
                            var $895 = ")";
                            var _clos$13 = $895;
                        };
                        var _body$14 = Fm$Term$show$go$($890(Fm$Term$var$($887, 0n))(Fm$Term$var$($888, 0n)), Fm$MPath$i$(_path$2));
                        var $891 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $876 = $891;
                        break;
                    case 'Fm.Term.lam':
                        var $896 = self.name;
                        var $897 = self.body;
                        var _name$5 = Fm$Name$show$($896);
                        var _body$6 = Fm$Term$show$go$($897(Fm$Term$var$($896, 0n)), Fm$MPath$o$(_path$2));
                        var $898 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $876 = $898;
                        break;
                    case 'Fm.Term.app':
                        var $899 = self.func;
                        var $900 = self.argm;
                        var $901 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $876 = $901;
                        break;
                    case 'Fm.Term.let':
                        var $902 = self.name;
                        var $903 = self.expr;
                        var $904 = self.body;
                        var _name$6 = Fm$Name$show$($902);
                        var _expr$7 = Fm$Term$show$go$($903, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($904(Fm$Term$var$($902, 0n)), Fm$MPath$i$(_path$2));
                        var $905 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $876 = $905;
                        break;
                    case 'Fm.Term.def':
                        var $906 = self.name;
                        var $907 = self.expr;
                        var $908 = self.body;
                        var _name$6 = Fm$Name$show$($906);
                        var _expr$7 = Fm$Term$show$go$($907, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($908(Fm$Term$var$($906, 0n)), Fm$MPath$i$(_path$2));
                        var $909 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $876 = $909;
                        break;
                    case 'Fm.Term.ann':
                        var $910 = self.done;
                        var $911 = self.term;
                        var $912 = self.type;
                        var _term$6 = Fm$Term$show$go$($911, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($912, Fm$MPath$i$(_path$2));
                        var $913 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $876 = $913;
                        break;
                    case 'Fm.Term.gol':
                        var $914 = self.name;
                        var $915 = self.dref;
                        var $916 = self.verb;
                        var _name$6 = Fm$Name$show$($914);
                        var $917 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $876 = $917;
                        break;
                    case 'Fm.Term.hol':
                        var $918 = self.path;
                        var $919 = "_";
                        var $876 = $919;
                        break;
                    case 'Fm.Term.nat':
                        var $920 = self.natx;
                        var $921 = String$flatten$(List$cons$(Nat$show$($920), List$nil));
                        var $876 = $921;
                        break;
                    case 'Fm.Term.chr':
                        var $922 = self.chrx;
                        var $923 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($922), List$cons$("\'", List$nil))));
                        var $876 = $923;
                        break;
                    case 'Fm.Term.str':
                        var $924 = self.strx;
                        var $925 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($924), List$cons$("\"", List$nil))));
                        var $876 = $925;
                        break;
                    case 'Fm.Term.cse':
                        var $926 = self.path;
                        var $927 = self.expr;
                        var $928 = self.name;
                        var $929 = self.with;
                        var $930 = self.cses;
                        var $931 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($927, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($928);
                        var _wyth$11 = String$join$("", List$mapped$($929, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $934 = self.file;
                                    var $935 = self.code;
                                    var $936 = self.orig;
                                    var $937 = self.name;
                                    var $938 = self.term;
                                    var $939 = self.type;
                                    var $940 = self.isct;
                                    var $941 = self.stat;
                                    var _name$20 = Fm$Name$show$($937);
                                    var _type$21 = Fm$Term$show$go$($939, Maybe$none);
                                    var _term$22 = Fm$Term$show$go$($938, Maybe$none);
                                    var $942 = String$flatten$(List$cons$(_name$20, List$cons$(": ", List$cons$(_type$21, List$cons$(" = ", List$cons$(_term$22, List$cons$(";", List$nil)))))));
                                    var $933 = $942;
                                    break;
                            };
                            return $933;
                        })));
                        var _cses$12 = Map$to_list$($930);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $943 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $943;
                        })));
                        var self = $931;
                        switch (self._) {
                            case 'Maybe.none':
                                var $944 = "";
                                var _moti$14 = $944;
                                break;
                            case 'Maybe.some':
                                var $945 = self.value;
                                var $946 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($945, Maybe$none), List$nil)));
                                var _moti$14 = $946;
                                break;
                        };
                        var $932 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $876 = $932;
                        break;
                    case 'Fm.Term.ori':
                        var $947 = self.orig;
                        var $948 = self.expr;
                        var $949 = Fm$Term$show$go$($948, _path$2);
                        var $876 = $949;
                        break;
                };
                var $875 = $876;
                break;
            case 'Maybe.some':
                var $950 = self.value;
                var $951 = $950;
                var $875 = $951;
                break;
        };
        return $875;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $952 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $952;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);
    const Test = (() => {
        var self = Fm$Core$read$term$("#f #x (f (f x))");
        switch (self._) {
            case 'Pair.new':
                var $953 = self.fst;
                var $954 = self.snd;
                var _term$3 = $954(List$nil);
                var $955 = Fm$Term$show$(_term$3);
                return $955;
        };
    })();
    return {
        'Unit.new': Unit$new,
        'Debug.log': Debug$log,
        'Pair': Pair,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.nil': String$nil,
        'Pair.new': Pair$new,
        'Bool.true': Bool$true,
        'Bool.or': Bool$or,
        'Bool.false': Bool$false,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.eql': U16$eql,
        'Fm.Core.read.spaces': Fm$Core$read$spaces,
        'Fm.Term.ref': Fm$Term$ref,
        'Char.eql': Char$eql,
        'Fm.Term.typ': Fm$Term$typ,
        'Bool.and': Bool$and,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'U16.gte': U16$gte,
        'Nat.apply': Nat$apply,
        'U16.new': U16$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'U16.inc': U16$inc,
        'Word.zero': Word$zero,
        'U16.zero': U16$zero,
        'Nat.to_u16': Nat$to_u16,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.ltn': Word$ltn,
        'U16.ltn': U16$ltn,
        'Fm.Core.read.is_name': Fm$Core$read$is_name,
        'Fm.Core.read.name': Fm$Core$read$name,
        'Fm.Core.read.char': Fm$Core$read$char,
        'Fm.Term.all': Fm$Term$all,
        'List.cons': List$cons,
        'Fm.Term.lam': Fm$Term$lam,
        'Fm.Term.app': Fm$Term$app,
        'Fm.Term.let': Fm$Term$let,
        'Fm.Term.def': Fm$Term$def,
        'Fm.Term.ann': Fm$Term$ann,
        'String.starts_with': String$starts_with,
        'String.drop': String$drop,
        'Char.is_hex': Char$is_hex,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U16.add': U16$add,
        'Word.mul': Word$mul,
        'U16.mul': U16$mul,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U16.sub': U16$sub,
        'Char.hex_value16': Char$hex_value16,
        'Fm.Core.read.u16': Fm$Core$read$u16,
        'Fm.Core.read.chrx': Fm$Core$read$chrx,
        'Fm.Term.chr': Fm$Term$chr,
        'Fm.Core.read.strx': Fm$Core$read$strx,
        'Fm.Term.str': Fm$Term$str,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Char.dec_value': Char$dec_value,
        'Fm.Core.read.natx': Fm$Core$read$natx,
        'Fm.Term.nat': Fm$Term$nat,
        'String.eql': String$eql,
        'Pair.fst': Pair$fst,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Nat.eql': Nat$eql,
        'Maybe.some': Maybe$some,
        'Nat.pred': Nat$pred,
        'Fm.Core.read.find': Fm$Core$read$find,
        'Pair.snd': Pair$snd,
        'Fm.Core.read.term': Fm$Core$read$term,
        'List.nil': List$nil,
        'Maybe.mapped': Maybe$mapped,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Fm.Term.show.as_nat.go': Fm$Term$show$as_nat$go,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Fm.Term.show.as_nat': Fm$Term$show$as_nat,
        'Fm.Name.show': Fm$Name$show,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Bits.e': Bits$e,
        'Fm.Path.to_bits': Fm$Path$to_bits,
        'Bits.to_nat': Bits$to_nat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'Fm.color': Fm$color,
        'Fm.Path.o': Fm$Path$o,
        'Fm.MPath.o': Fm$MPath$o,
        'Fm.Term.var': Fm$Term$var,
        'Fm.Path.i': Fm$Path$i,
        'Fm.MPath.i': Fm$MPath$i,
        'List.length': List$length,
        'Fm.Term.show.is_ref': Fm$Term$show$is_ref,
        'Maybe.default': Maybe$default,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Fm.Term.show.app.done': Fm$Term$show$app$done,
        'Fm.Term.show.app': Fm$Term$show$app,
        'Fm.backslash': Fm$backslash,
        'U16.btw': U16$btw,
        'Word.to_bits': Word$to_bits,
        'U16.show_hex': U16$show_hex,
        'Fm.escape.char': Fm$escape$char,
        'Fm.escape': Fm$escape,
        'List.mapped': List$mapped,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'Map.to_list.go': Map$to_list$go,
        'Map.to_list': Map$to_list,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Word.from_bits': Word$from_bits,
        'Fm.Name.from_bits': Fm$Name$from_bits,
        'Fm.Term.show.go': Fm$Term$show$go,
        'Fm.Term.show': Fm$Term$show,
        'Test': Test,
    };
})();
var MAIN = module.exports['Test'];
try {
    console.log(JSON.stringify(MAIN, null, 2) || '<unprintable>')
} catch (e) {
    console.log(MAIN);
};