from itertools import permutations, combinations
def show(name, sols): print(f"\n== {name}: {len(sols)} solusi"); [print("  ", s) for s in sols]

# P1 urutan wawancara A-F posisi 1..6
sols=[]
for p in permutations('ABCDEF'):
    pos={c:i+1 for i,c in enumerate(p)}
    if pos['D']!=1: continue
    if pos['E']-pos['B']!=1: continue
    if not pos['C']>pos['F']: continue
    if pos['A']==6: continue
    if not pos['F']>pos['E']: continue
    sols.append(''.join(p))
show('P1',sols)
print('  C selalu terakhir:', all(s[5]=='C' for s in sols))
print('  A tepat setelah E -> F di:', [s.index('F')+1 for s in sols if s.index('A')==s.index('E')+1])
print('  E sebelum C selalu:', all(s.index('E')<s.index('C') for s in sols), '| F kelima selalu:', all(s.index('F')==4 for s in sols), '| A setelah B selalu:', all(s.index('A')>s.index('B') for s in sols))
print('  B ketiga -> urutan2:', [s[1] for s in sols if s.index('B')==2])

# P2 seminar Senin-Jumat H I J K L
sols=[]
for p in permutations('HIJKL'):
    d={c:i+1 for i,c in enumerate(p)}
    if d['I']-d['H']!=1: continue
    if d['J'] in (1,5): continue
    if not d['K']<d['J']: continue
    if d['L']!=3: continue
    sols.append(''.join(p))
show('P2 (urutan Senin..Jumat)',sols)

# P3 tim Alfa(3)/Beta(4)
sols=[]
for alfa in combinations('PQRSTUV',3):
    A=set(alfa)
    if ('P' in A)==('Q' in A): continue
    if ('R' in A)!=('S' in A): continue
    if 'T' in A and 'U' in A: continue
    if 'V' not in A: continue
    sols.append(''.join(sorted(A)))
show('P3 Alfa',sols)
print('  R/S selalu Beta:', all('R' not in s and 'S' not in s for s in sols))
print('  Q Alfa & U Beta ->', [s for s in sols if 'Q' in s and 'U' not in s])
for x in 'RPQTU': print('  ',x,'pernah di Alfa:', any(x in s for s in sols))

# P4 rumah warna 1..5 barat->timur
sols=[]
for p in permutations(['merah','kuning','hijau','biru','putih']):
    n={c:i+1 for i,c in enumerate(p)}
    if n['hijau']-n['putih']!=1: continue
    if n['merah'] not in (1,5): continue
    if n['kuning']!=3: continue
    base=(n['biru']!=2)
    sols.append((p,base))
show('P4 semua (tanpa aturan biru)',[s[0] for s in sols])
print('  dengan aturan biru:', [s[0] for s in sols if s[1]])

# P5 meja bundar 6 kursi 0..5, A=0 D=3 (A berhadapan D)
sols=[]
for p in permutations('BCEF'):
    seat={'A':0,'D':3}
    for c,s in zip(p,[1,2,4,5]): seat[c]=s
    adj=lambda x,y: (seat[x]-seat[y])%6 in (1,5)
    opp=lambda x,y: (seat[x]-seat[y])%6==3
    if not adj('B','A'): continue
    if adj('C','D'): continue
    if not adj('E','D'): continue
    sols.append(dict(seat))
show('P5',[sorted(s.items(),key=lambda x:x[1]) for s in sols])
inv=lambda s:{v:k for k,v in s.items()}
print('  tetangga A:', set(frozenset([inv(s)[1],inv(s)[5]]) for s in sols))
print('  E sebelah B -> lawan C:', [inv(s)[(s['C']+3)%6] for s in sols if (s['E']-s['B'])%6 in (1,5)])
print('  F tetangga:', [ {inv(s)[(s['F']+1)%6],inv(s)[(s['F']-1)%6]} for s in sols])
print('  A sebelah E pernah:', any((s['A']-s['E'])%6 in (1,5) for s in sols), '| B sebelah F pernah:', any((s['B']-s['F'])%6 in (1,5) for s in sols), '| C sebelah E pernah:', any((s['C']-s['E'])%6 in (1,5) for s in sols), '| F hadap C pernah:', any((s['F']-s['C'])%6==3 for s in sols))

# P6 topik 3 dari 6
sols=[]
for c in combinations('EHKLPT',3):
    S=set(c)
    if 'E' in S and 'H' in S: continue
    if ('K' in S)==('L' in S): continue
    if 'T' in S and 'P' not in S: continue
    if 'H' not in S: continue
    sols.append(''.join(sorted(S)))
show('P6',sols)

# P7 nilai
sols=[]
for p in permutations('RSTUV'):  # p[0]=tertinggi
    r={c:i for i,c in enumerate(p)}
    if not (r['S']<r['R'] and r['S']>r['V']): continue
    if r['T']!=0: continue
    if not r['U']>r['R']: continue
    sols.append(''.join(p))
show('P7 (tertinggi->terendah)',sols)

# P8 gedung lantai 1..5
sols=[]
for p in permutations(['Keu','SDM','IT','Pem','Legal']):
    f={c:i+1 for i,c in enumerate(p)}
    if f['IT']-f['Keu']!=1: continue
    if f['Legal']!=5: continue
    if f['SDM']==1: continue
    if not f['Pem']<f['Keu']: continue
    sols.append(p)
show('P8 (lantai1..5)',sols)
