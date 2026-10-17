const e = (n, r, a, i, l = 'Team Principal') => ({
    fullName: n,
    base: r,
    teamLead: a,
    teamLeadTitle: l,
    powerUnit: i,
  }),
  o = {
    ferrari: {
      2024: e('Scuderia Ferrari HP', 'Maranello, Italy', 'Frédéric Vasseur', 'Ferrari'),
      2025: e('Scuderia Ferrari HP', 'Maranello, Italy', 'Frédéric Vasseur', 'Ferrari'),
      2026: e('Scuderia Ferrari HP', 'Maranello, Italy', 'Frédéric Vasseur', 'Ferrari'),
    },
    mclaren: {
      2024: e('McLaren Formula 1 Team', 'Woking, United Kingdom', 'Andrea Stella', 'Mercedes'),
      2025: e('McLaren Formula 1 Team', 'Woking, United Kingdom', 'Andrea Stella', 'Mercedes'),
      2026: e('McLaren Mastercard F1 Team', 'Woking, United Kingdom', 'Andrea Stella', 'Mercedes'),
    },
    redbull: {
      2024: e(
        'Oracle Red Bull Racing',
        'Milton Keynes, United Kingdom',
        'Christian Horner',
        'Honda RBPT',
      ),
      2025: e(
        'Oracle Red Bull Racing',
        'Milton Keynes, United Kingdom',
        'Laurent Mekies',
        'Honda RBPT',
      ),
      2026: e(
        'Oracle Red Bull Racing',
        'Milton Keynes, United Kingdom',
        'Laurent Mekies',
        'Red Bull Ford',
      ),
    },
    mercedes: {
      2024: e(
        'Mercedes-AMG PETRONAS Formula One Team',
        'Brackley, United Kingdom',
        'Toto Wolff',
        'Mercedes',
      ),
      2025: e(
        'Mercedes-AMG PETRONAS Formula One Team',
        'Brackley, United Kingdom',
        'Toto Wolff',
        'Mercedes',
      ),
      2026: e(
        'Mercedes-AMG PETRONAS Formula One Team',
        'Brackley, United Kingdom',
        'Toto Wolff',
        'Mercedes',
      ),
    },
    astonmartin: {
      2024: e(
        'Aston Martin Aramco Formula One Team',
        'Silverstone, United Kingdom',
        'Mike Krack',
        'Mercedes',
      ),
      2025: e(
        'Aston Martin Aramco Formula One Team',
        'Silverstone, United Kingdom',
        'Andy Cowell',
        'Mercedes',
      ),
      2026: e(
        'Aston Martin Aramco Formula One Team',
        'Silverstone, United Kingdom',
        'Adrian Newey',
        'Honda',
      ),
    },
    alpine: {
      2024: e(
        'BWT Alpine F1 Team',
        'Enstone, United Kingdom / Viry, France',
        'Oliver Oakes',
        'Renault',
      ),
      2025: e(
        'BWT Alpine Formula One Team',
        'Enstone, United Kingdom',
        'Flavio Briatore',
        'Renault',
        'Acting team lead',
      ),
      2026: e(
        'BWT Alpine Formula One Team',
        'Enstone, United Kingdom',
        'Flavio Briatore / Steve Nielsen',
        'Mercedes',
        'Executive advisor / Managing director',
      ),
    },
    racingbulls: {
      2024: e('Visa Cash App RB Formula One Team', 'Faenza, Italy', 'Laurent Mekies', 'Honda RBPT'),
      2025: e(
        'Visa Cash App Racing Bulls Formula One Team',
        'Faenza, Italy',
        'Alan Permane',
        'Honda RBPT',
      ),
      2026: e(
        'Visa Cash App Racing Bulls Formula One Team',
        'Faenza, Italy',
        'Alan Permane',
        'Red Bull Ford',
      ),
    },
    haas: {
      2024: e('MoneyGram Haas F1 Team', 'Kannapolis, United States', 'Ayao Komatsu', 'Ferrari'),
      2025: e('MoneyGram Haas F1 Team', 'Kannapolis, United States', 'Ayao Komatsu', 'Ferrari'),
      2026: e('TGR Haas F1 Team', 'Kannapolis, United States', 'Ayao Komatsu', 'Ferrari'),
    },
    williams: {
      2024: e('Williams Racing', 'Grove, United Kingdom', 'James Vowles', 'Mercedes'),
      2025: e('Atlassian Williams Racing', 'Grove, United Kingdom', 'James Vowles', 'Mercedes'),
      2026: e('Williams F1 Team', 'Grove, United Kingdom', 'James Vowles', 'Mercedes'),
    },
    audi: {
      2024: e(
        'Stake F1 Team Kick Sauber',
        'Hinwil, Switzerland',
        'Alessandro Alunni Bravi',
        'Ferrari',
        'Team Representative',
      ),
      2025: e('Stake F1 Team Kick Sauber', 'Hinwil, Switzerland', 'Jonathan Wheatley', 'Ferrari'),
      2026: e('Audi Revolut F1 Team', 'Hinwil, Switzerland', 'Mattia Binotto', 'Audi'),
    },
    cadillac: {
      2026: e(
        'Cadillac Formula 1 Team',
        'Fishers, United States / Silverstone, United Kingdom',
        'Marcin Budkowski',
        'Ferrari',
      ),
    },
  },
  t = (n, r) => {
    var a;
    return (a = o[n]) == null ? void 0 : a[r];
  };
export { t as g };
